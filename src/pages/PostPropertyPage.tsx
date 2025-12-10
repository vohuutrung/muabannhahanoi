import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Phone, Loader2 } from "lucide-react";

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type VipType = "none" | "KIMCUONG" | "VANG" | "BAC";

interface FormData {
  title: string;
  description: string;
  price: string;
  area: string;
  floors: string;
  bedrooms: string;
  bathrooms: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  alley: string;
  vipType: VipType;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PostPropertyPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    area: "",
    floors: "",
    bedrooms: "",
    bathrooms: "",
    city: "Hà Nội",
    district: "",
    ward: "",
    street: "",
    alley: "",
    vipType: "none",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {  
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVipChange = (value: VipType) => {
    setFormData((prev) => ({ ...prev, vipType: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 20 - selectedImages.length);
    const validFiles: File[] = [];
    
    newFiles.forEach((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast({ 
          title: "Lỗi", 
          description: `File "${file.name}" không phải định dạng ảnh hợp lệ`, 
          variant: "destructive" 
        });
        return;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        toast({ 
          title: "Lỗi", 
          description: `File "${file.name}" vượt quá 5MB`, 
          variant: "destructive" 
        });
        return;
      }
      
      validFiles.push(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setSelectedImages((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast({ title: "Lỗi", description: "Vui lòng nhập tiêu đề", variant: "destructive" });
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({ title: "Lỗi", description: "Vui lòng nhập giá hợp lệ", variant: "destructive" });
      return false;
    }
    if (!formData.area || parseFloat(formData.area) <= 0) {
      toast({ title: "Lỗi", description: "Vui lòng nhập diện tích hợp lệ", variant: "destructive" });
      return false;
    }
    if (!formData.district.trim()) {
      toast({ title: "Lỗi", description: "Vui lòng nhập quận/huyện", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const slug = slugify(formData.title.trim());

      // INSERT TO PROPERTIES (NOT POSTS)
      const { data: property, error: insertError } = await supabase
        .from("properties")
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          price: parseFloat(formData.price),
          area: parseFloat(formData.area),
          floors: formData.floors ? parseInt(formData.floors) : null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          city: formData.city,
          district: formData.district.trim(),
          ward: formData.ward.trim() || null,
          street: formData.street.trim() || null,
          alley: formData.alley.trim() || null,
          listing_type: formData.vipType === "none" ? "thuong" : formData.vipType.toLowerCase(),
          slug: slug,
          user_id: user?.id,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error("Không thể tạo tin đăng");
      }

      const propertyId = property.id;

      // UPLOAD IMAGES
      const uploadedUrls: string[] = [];

      for (const file of selectedImages) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;
        const filePath = `properties/${propertyId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }

      // SAVE URLS TO property_images TABLE
      for (const url of uploadedUrls) {
        await supabase.from("property_images").insert({
          property_id: propertyId,
          image_url: url,
        });
      }

      toast({
        title: "Thành công",
        description: "Đăng tin thành công!",
      });

      navigate(`/nha-dat-ban/${slug}`);
      
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi đăng tin. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container py-6 lg:py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-6">Đăng tin bất động sản</h1>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Basic Info */}
            <section className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4 text-primary">Thông tin cơ bản</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề tin đăng *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="VD: Bán nhà riêng Thanh Xuân, 4 tầng, 50m²"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Mô tả chi tiết</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Mô tả chi tiết về bất động sản..."
                    rows={5}
                    className="mt-1"
                  />
                </div>
              </div>
            </section>

            {/* Price & Size */}
            <section className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4 text-primary">Giá & Diện tích</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Giá (triệu VNĐ) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="VD: 3500 (3,5 tỷ)"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="area">Diện tích (m²) *</Label>
                  <Input
                    id="area"
                    name="area"
                    type="number"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="VD: 50"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="floors">Số tầng</Label>
                  <Input
                    id="floors"
                    name="floors"
                    type="number"
                    value={formData.floors}
                    onChange={handleInputChange}
                    placeholder="VD: 4"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="bedrooms">Số phòng ngủ</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="VD: 3"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="bathrooms">Số phòng tắm</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="VD: 3"
                    className="mt-1"
                  />
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4 text-primary">Địa chỉ</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Thành phố</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1"
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="district">Quận/Huyện *</Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="VD: Thanh Xuân"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="ward">Phường/Xã</Label>
                  <Input
                    id="ward"
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    placeholder="VD: Nhân Chính"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="street">Đường/Phố</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="VD: Triều Khúc"
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="alley">Ngõ/Hẻm</Label>
                  <Input
                    id="alley"
                    name="alley"
                    value={formData.alley}
                    onChange={handleInputChange}
                    placeholder="VD: Ngõ 68"
                    className="mt-1"
                  />
                </div>
              </div>
            </section>

            {/* VIP Level */}
            <section className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4 text-primary">Loại tin</h2>
              
              <RadioGroup
                value={formData.vipType}
                onValueChange={handleVipChange}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="none" id="vip-none" />
                  <Label htmlFor="vip-none" className="cursor-pointer">Tin thường</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors border-red-200 bg-red-50">
                  <RadioGroupItem value="KIMCUONG" id="vip-diamond" />
                  <Label htmlFor="vip-diamond" className="cursor-pointer text-red-600 font-semibold">VIP Kim Cương</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors border-amber-200 bg-amber-50">
                  <RadioGroupItem value="VANG" id="vip-gold" />
                  <Label htmlFor="vip-gold" className="cursor-pointer text-amber-600 font-semibold">VIP Vàng</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors border-slate-200 bg-slate-50">
                  <RadioGroupItem value="BAC" id="vip-silver" />
                  <Label htmlFor="vip-silver" className="cursor-pointer text-slate-600 font-semibold">VIP Bạc</Label>
                </div>
              </RadioGroup>
            </section>

            {/* Images */}
            <section className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4 text-primary">Hình ảnh (tối đa 20 ảnh)</h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={selectedImages.length >= 20}
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Kéo thả hoặc click để tải ảnh lên
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Đã chọn: {selectedImages.length}/20 ảnh
                    </p>
                  </label>
                </div>

                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Đang đăng...
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5 mr-2" />
                    Đăng tin
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
