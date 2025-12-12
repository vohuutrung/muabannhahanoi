import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type VipType = "none" | "kimcuong" | "vang" | "bac";

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
  address: string;
  vipType: VipType;
  // Additional information fields
  legalDocuments: string;
  interior: string;
  houseDirection: string;
  balconyDirection: string;
  accessRoad: string;
  frontage: string;
}

const LEGAL_DOCUMENTS_OPTIONS = [
  "Sổ đỏ / Sổ hồng",
  "Hợp đồng mua bán",
  "Sổ chung",
  "Đang chờ sổ",
];

const INTERIOR_OPTIONS = [
  "Nội thất cơ bản",
  "Full nội thất",
  "Nội thất cao cấp",
  "Không nội thất",
];

const DIRECTION_OPTIONS = [
  "Đông", "Tây", "Nam", "Bắc",
  "Đông Bắc", "Đông Nam", "Tây Bắc", "Tây Nam",
];

export default function EditPropertyPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [property, setProperty] = useState<Tables<"properties"> | null>(null);
  
  // Existing images from database
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  // New images to upload
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

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
    address: "",
    vipType: "none",
    // Additional information fields
    legalDocuments: "",
    interior: "",
    houseDirection: "",
    balconyDirection: "",
    accessRoad: "",
    frontage: "",
  });

  // Load property data
  useEffect(() => {
    async function loadProperty() {
      if (!id) {
        toast({ title: "Lỗi", description: "ID bất động sản không hợp lệ", variant: "destructive" });
        navigate("/");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) {
          console.error("Error loading property:", error);
          throw error;
        }

        if (!data) {
          toast({ title: "Lỗi", description: "Không tìm thấy bất động sản", variant: "destructive" });
          navigate("/");
          return;
        }

        setProperty(data);
        setExistingImages(data.images || []);
        
        // Map vip_type to form value
        let vipType: VipType = "none";
        if (data.vip_type === "kimcuong") vipType = "kimcuong";
        else if (data.vip_type === "vang") vipType = "vang";
        else if (data.vip_type === "bac") vipType = "bac";

        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          area: data.area?.toString() || "",
          floors: data.floors?.toString() || "",
          bedrooms: data.bedrooms?.toString() || "",
          bathrooms: data.bathrooms?.toString() || "",
          city: data.city || "Hà Nội",
          district: data.district || "",
          ward: data.ward || "",
          street: data.street || "",
          address: data.address || "",
          vipType,
          // Additional information fields - pre-fill from database
          legalDocuments: (data as any).legal_documents || "",
          interior: (data as any).interior || "",
          houseDirection: (data as any).house_direction || "",
          balconyDirection: (data as any).balcony_direction || "",
          accessRoad: (data as any).access_road?.toString() || "",
          frontage: (data as any).frontage?.toString() || "",
        });
      } catch (error) {
        console.error("Failed to load property:", error);
        toast({ title: "Lỗi", description: "Không thể tải thông tin bất động sản", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }

    loadProperty();
  }, [id, navigate, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVipChange = (value: VipType) => {
    setFormData((prev) => ({ ...prev, vipType: value }));
  };

  // Toggle existing image for deletion
  const toggleDeleteExistingImage = (imageUrl: string) => {
    setImagesToDelete((prev) => 
      prev.includes(imageUrl) 
        ? prev.filter(url => url !== imageUrl)
        : [...prev, imageUrl]
    );
  };

  // Handle new image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const totalCurrentImages = existingImages.length - imagesToDelete.length + newImages.length;
    const maxNewFiles = 20 - totalCurrentImages;
    const filesToAdd = Array.from(files).slice(0, maxNewFiles);
    
    const validFiles: File[] = [];

    filesToAdd.forEach((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Lỗi",
          description: `File "${file.name}" không phải định dạng ảnh hợp lệ`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Lỗi",
          description: `File "${file.name}" vượt quá 5MB`,
          variant: "destructive",
        });
        return;
      }

      validFiles.push(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setNewImages((prev) => [...prev, ...validFiles]);
  };

  // Remove new image
  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
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

    if (!validateForm() || !id) return;

    setIsSubmitting(true);

    try {
      // Upload new images
      const uploadedUrls: string[] = [];

      for (const file of newImages) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `properties/${id}/${fileName}`;

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

      // Build final images array: existing (minus deleted) + new uploads
      const finalImages = [
        ...existingImages.filter(url => !imagesToDelete.includes(url)),
        ...uploadedUrls
      ];

      // Update property
      const { error: updateError } = await supabase
        .from("properties")
        .update({
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
          address: formData.address.trim() || null,
          vip_type: formData.vipType === "none" ? null : formData.vipType,
          images: finalImages,
          updated_at: new Date().toISOString(),
          // Additional information fields
          legal_documents: formData.legalDocuments || null,
          interior: formData.interior || null,
          house_direction: formData.houseDirection || null,
          balcony_direction: formData.balconyDirection || null,
          access_road: formData.accessRoad ? parseFloat(formData.accessRoad) : null,
          frontage: formData.frontage ? parseFloat(formData.frontage) : null,
        } as any)
        .eq("id", id);

      if (updateError) {
        console.error("Update error:", updateError);
        throw new Error("Không thể cập nhật tin đăng");
      }

      toast({
        title: "Thành công",
        description: "Cập nhật tin đăng thành công!",
      });

      // Navigate back to property detail
      navigate(`/nha-dat-ban/${id}`);
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-10 flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="container py-10 text-center">
          <p className="text-muted-foreground">Không tìm thấy bất động sản</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Về trang chủ
          </Button>
        </div>
      </Layout>
    );
  }

  const totalImages = existingImages.length - imagesToDelete.length + newImages.length;

  return (
    <Layout>
      <div className="container py-6 lg:py-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl lg:text-3xl font-bold">Chỉnh sửa tin đăng</h1>
          </div>

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
                  <Label htmlFor="address">Địa chỉ đầy đủ</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="VD: Ngõ 68 Triều Khúc, Nhân Chính, Thanh Xuân, Hà Nội"
                    className="mt-1"
                  />
                </div>
              </div>
            </section>

            {/* Additional Information */}
            <section className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4 text-primary">Thông tin khác</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="legalDocuments">Giấy tờ pháp lý</Label>
                  <select
                    id="legalDocuments"
                    name="legalDocuments"
                    value={formData.legalDocuments}
                    onChange={(e) => setFormData((prev) => ({ ...prev, legalDocuments: e.target.value }))}
                    className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">Chọn loại giấy tờ</option>
                    {LEGAL_DOCUMENTS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="interior">Nội thất</Label>
                  <select
                    id="interior"
                    name="interior"
                    value={formData.interior}
                    onChange={(e) => setFormData((prev) => ({ ...prev, interior: e.target.value }))}
                    className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">Chọn tình trạng nội thất</option>
                    {INTERIOR_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="houseDirection">Hướng nhà</Label>
                  <select
                    id="houseDirection"
                    name="houseDirection"
                    value={formData.houseDirection}
                    onChange={(e) => setFormData((prev) => ({ ...prev, houseDirection: e.target.value }))}
                    className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">Chọn hướng nhà</option>
                    {DIRECTION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="balconyDirection">Hướng ban công</Label>
                  <select
                    id="balconyDirection"
                    name="balconyDirection"
                    value={formData.balconyDirection}
                    onChange={(e) => setFormData((prev) => ({ ...prev, balconyDirection: e.target.value }))}
                    className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">Chọn hướng ban công</option>
                    {DIRECTION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="accessRoad">Đường vào (m)</Label>
                  <Input
                    id="accessRoad"
                    name="accessRoad"
                    type="number"
                    step="0.1"
                    value={formData.accessRoad}
                    onChange={handleInputChange}
                    placeholder="VD: 3.5"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="frontage">Mặt tiền (m)</Label>
                  <Input
                    id="frontage"
                    name="frontage"
                    type="number"
                    step="0.1"
                    value={formData.frontage}
                    onChange={handleInputChange}
                    placeholder="VD: 4.5"
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
                  <RadioGroupItem value="kimcuong" id="vip-diamond" />
                  <Label htmlFor="vip-diamond" className="cursor-pointer text-red-600 font-semibold">VIP Kim Cương</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors border-amber-200 bg-amber-50">
                  <RadioGroupItem value="vang" id="vip-gold" />
                  <Label htmlFor="vip-gold" className="cursor-pointer text-amber-600 font-semibold">VIP Vàng</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors border-slate-200 bg-slate-50">
                  <RadioGroupItem value="bac" id="vip-silver" />
                  <Label htmlFor="vip-silver" className="cursor-pointer text-slate-600 font-semibold">VIP Bạc</Label>
                </div>
              </RadioGroup>
            </section>

            {/* Images */}
            <section className="bg-card rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4 text-primary">
                Hình ảnh ({totalImages}/20 ảnh)
              </h2>

              <div className="space-y-6">
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Ảnh hiện tại (click để đánh dấu xóa)
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {existingImages.map((url, index) => {
                        const isMarkedForDeletion = imagesToDelete.includes(url);
                        return (
                          <div
                            key={`existing-${index}`}
                            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                              isMarkedForDeletion 
                                ? "border-red-500 opacity-50" 
                                : "border-transparent hover:border-primary"
                            }`}
                            onClick={() => toggleDeleteExistingImage(url)}
                          >
                            <img
                              src={url}
                              alt={`Property image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {isMarkedForDeletion && (
                              <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                                <Trash2 className="w-8 h-8 text-white" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {imagesToDelete.length > 0 && (
                      <p className="text-sm text-red-500 mt-2">
                        Sẽ xóa {imagesToDelete.length} ảnh khi lưu
                      </p>
                    )}
                  </div>
                )}

                {/* Upload New Images */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Thêm ảnh mới
                  </h3>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={totalImages >= 20}
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Kéo thả hoặc click để tải ảnh lên
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Còn có thể thêm: {20 - totalImages} ảnh
                      </p>
                    </label>
                  </div>

                  {/* New Image Previews */}
                  {newImagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                      {newImagePreviews.map((url, index) => (
                        <div
                          key={`new-${index}`}
                          className="relative aspect-square rounded-lg overflow-hidden group border-2 border-green-500"
                        >
                          <img
                            src={url}
                            alt={`New image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                            Mới
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

