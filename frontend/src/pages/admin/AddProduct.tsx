import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";
import { getImageUrl } from "@/lib/utils";

interface Category {
    _id: string;
    parent: string;
    name: string;
    image: string;
}

interface DiamondSlab {
    _id: string;
    name: string;
}

const AddProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [diamondSlabs, setDiamondSlabs] = useState<DiamondSlab[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        itemCode: "",
        description: "",
        category: "",
        subcategory: "",
        screwType: "",
        inStock: true,
        price: "0"
    });

    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    // Gold Details State
    const [goldDetails, setGoldDetails] = useState({
        grossWeight: "",
        metalPurity: "22kt",
        metalColor: "Yellow",
        dimensions: ""
    });

    // Diamond Details State Array
    const [diamondDetails, setDiamondDetails] = useState([
        { quality: "EF-VVS", slab: "", count: "", weight: "" }
    ]);

    // Color Stone Details State Array
    const [colorStoneDetails, setColorStoneDetails] = useState([
        { quality: "Natural Gems", description: "", count: "", weight: "" }
    ]);

    // Pricing Details State (Default Values will be overwritten by fetch)
    const [pricingDetails, setPricingDetails] = useState({
        makingChargesPerGram: "1000",
        wastagePercentage: {
            "22kt": "20",
            "18kt": "25",
            "14kt": "30",
            "9kt": "35"
        }
    });

    useEffect(() => {
        fetchCategories();
        fetchDiamondSlabs();
        if (id) fetchProduct();
    }, [id]);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/categories`);
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchDiamondSlabs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/diamond-slabs`);
            const data = await res.json();
            setDiamondSlabs(data);
        } catch (error) {
            console.error("Failed to fetch diamond slabs", error);
        }
    };

    const fetchProduct = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/products/${id}`);
            const data = await res.json();

            setFormData({
                name: data.name,
                itemCode: data.itemCode || "",
                description: data.description,
                category: data.category,
                subcategory: data.subcategory || "",
                screwType: data.screwType || "",
                inStock: data.inStock !== undefined ? data.inStock : true,
                price: data.price.toString(),
                productId: data.productId // Access System ID
            } as any);

            if (data.images) {
                setExistingImages(data.images);
            }

            if (data.goldDetails) {
                setGoldDetails({
                    grossWeight: data.goldDetails.grossWeight,
                    metalPurity: data.goldDetails.metalPurity,
                    metalColor: data.goldDetails.metalColor,
                    dimensions: data.goldDetails.dimensions || ""
                });
            }

            if (data.diamondDetails && data.diamondDetails.length > 0) {
                setDiamondDetails(data.diamondDetails.map((d: any) => ({
                    quality: d.quality,
                    slab: d.slab,
                    count: d.count,
                    weight: d.weight
                })));
            }

            if (data.colorStoneDetails && data.colorStoneDetails.length > 0) {
                setColorStoneDetails(data.colorStoneDetails.map((c: any) => ({
                    quality: c.quality,
                    description: c.description || "",
                    count: c.count,
                    weight: c.weight
                })));
            }

            if (data.pricingDetails) {
                setPricingDetails({
                    makingChargesPerGram: data.pricingDetails.makingChargesPerGram?.toString() || "1000",
                    wastagePercentage: {
                        "22kt": data.pricingDetails.wastagePercentage?.["22kt"]?.toString() || "20",
                        "18kt": data.pricingDetails.wastagePercentage?.["18kt"]?.toString() || "25",
                        "14kt": data.pricingDetails.wastagePercentage?.["14kt"]?.toString() || "30",
                        "9kt": data.pricingDetails.wastagePercentage?.["9kt"]?.toString() || "35"
                    }
                });
            }
        } catch (error) {
            console.error("Failed to fetch product", error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviewImages(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    // Diamond Helpers
    const addDiamondRow = () => {
        const currentQuality = diamondDetails.length > 0 ? diamondDetails[0].quality : "EF-VVS";
        setDiamondDetails([...diamondDetails, { quality: currentQuality, slab: "", count: "", weight: "" }]);
    };
    const removeDiamondRow = (index: number) => {
        setDiamondDetails(diamondDetails.filter((_, i) => i !== index));
    };
    const updateDiamondRow = (index: number, field: string, value: string) => {
        const newDetails = [...diamondDetails];
        (newDetails[index] as any)[field] = value;
        setDiamondDetails(newDetails);
    };

    // Color Stone Helpers
    const addColorStoneRow = () => {
        setColorStoneDetails([...colorStoneDetails, { quality: "Natural Gems", description: "", count: "", weight: "" }]);
    };
    const removeColorStoneRow = (index: number) => {
        setColorStoneDetails(colorStoneDetails.filter((_, i) => i !== index));
    };
    const updateColorStoneRow = (index: number, field: string, value: string) => {
        const newDetails = [...colorStoneDetails];
        (newDetails[index] as any)[field] = value;
        setColorStoneDetails(newDetails);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('itemCode', formData.itemCode);
        payload.append('description', formData.description);
        payload.append('category', formData.category);
        payload.append('subcategory', formData.subcategory);
        if (formData.screwType) payload.append('screwType', formData.screwType);
        payload.append('price', formData.price);

        payload.append('goldDetails', JSON.stringify({
            grossWeight: Number(goldDetails.grossWeight),
            metalPurity: goldDetails.metalPurity,
            metalColor: goldDetails.metalColor,
            dimensions: goldDetails.dimensions
        }));

        payload.append('diamondDetails', JSON.stringify(diamondDetails.map(d => ({
            ...d,
            count: Number(d.count),
            weight: Number(d.weight)
        }))));

        payload.append('colorStoneDetails', JSON.stringify(colorStoneDetails.map(c => ({
            ...c,
            count: Number(c.count),
            weight: Number(c.weight)
        }))));

        payload.append('pricingDetails', JSON.stringify({
            makingChargesPerGram: Number(pricingDetails.makingChargesPerGram),
            wastagePercentage: {
                "22kt": Number(pricingDetails.wastagePercentage["22kt"]),
                "18kt": Number(pricingDetails.wastagePercentage["18kt"]),
                "14kt": Number(pricingDetails.wastagePercentage["14kt"]),
                "9kt": Number(pricingDetails.wastagePercentage["9kt"])
            }
        }));

        if (id) {
            payload.append('existingImages', JSON.stringify(existingImages));
        }

        images.forEach((image) => {
            payload.append('images', image);
        });

        try {
            const token = localStorage.getItem('token');
            const url = id
                ? `${API_BASE_URL}/api/v1/products/${id}`
                : `${API_BASE_URL}/api/v1/products`;

            const method = id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` },
                body: payload
            });

            if (!res.ok) throw new Error('Failed to save product');

            toast.success(id ? 'Product updated' : 'Product created');
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            toast.error('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const parentCategories = categories.filter(c => !c.parent);
    const subCategories = categories.filter(c => {
        if (!c.parent) return false;
        // Handle if parent is populated object or just ID string
        const parentId = typeof c.parent === 'object' ? (c.parent as any)._id : c.parent;
        return parentId === formData.category;
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <h1 className="text-3xl font-serif font-bold text-primary">
                {id ? 'Edit Product' : 'Add New Product'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* 1. Basic Info */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <h3 className="text-lg font-semibold">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Product Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Item Code (Mandatory)</Label>
                                <Input
                                    value={formData.itemCode}
                                    onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Product ID (Read Only) */}
                            {id && (
                                <div className="space-y-2 col-span-2">
                                    <Label>System Product ID (Auto-Generated)</Label>
                                    <Input
                                        value={(formData as any).productId || "Will be generated"}
                                        readOnly
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <input
                                type="checkbox"
                                id="inStock"
                                checked={formData.inStock}
                                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="inStock">In Stock</Label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val, subcategory: '' })}>
                                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                    <SelectContent>
                                        {parentCategories.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Sub Category</Label>
                                <Select value={formData.subcategory} onValueChange={(val) => setFormData({ ...formData, subcategory: val })} disabled={!formData.category}>
                                    <SelectTrigger><SelectValue placeholder="Select Sub Category" /></SelectTrigger>
                                    <SelectContent>
                                        {subCategories.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Conditional Screw Type for Studs/Earrings */}
                        {(() => {
                            const selectedCat = categories.find(c => c._id === formData.category);
                            // Match "steds", "studs", "earring"
                            if (selectedCat && /sted|stud|earring/i.test(selectedCat.name)) {
                                return (
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="space-y-2">
                                            <Label>Screw Type</Label>
                                            <Select value={formData.screwType} onValueChange={(val) => setFormData({ ...formData, screwType: val })}>
                                                <SelectTrigger><SelectValue placeholder="Select Screw Type" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="South Screw">South Screw</SelectItem>
                                                    <SelectItem value="North Screw">North Screw</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Gold Details */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <h3 className="text-lg font-semibold">Gold Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label>Gross Weight (g)</Label>
                                <Input
                                    type="number" step="0.001"
                                    value={goldDetails.grossWeight}
                                    onChange={(e) => setGoldDetails({ ...goldDetails, grossWeight: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Purity</Label>
                                <Select value={goldDetails.metalPurity} onValueChange={(val) => setGoldDetails({ ...goldDetails, metalPurity: val })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {['22kt', '18kt', '14kt', '9kt'].map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Color</Label>
                                <Select value={goldDetails.metalColor} onValueChange={(val) => setGoldDetails({ ...goldDetails, metalColor: val })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {['Yellow', 'Rose', 'White'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Dimensions (Optional)</Label>
                                <Input
                                    value={goldDetails.dimensions}
                                    onChange={(e) => setGoldDetails({ ...goldDetails, dimensions: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Diamond Details */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">Diamond Details</h3>
                                <p className="text-sm text-muted-foreground">Add all diamond components.</p>
                            </div>

                            <Button type="button" variant="outline" size="sm" onClick={addDiamondRow}>
                                <Plus className="w-4 h-4 mr-2" /> Add Diamond Row
                            </Button>
                        </div>

                        {/* Global Quality Selector */}
                        <div className="w-full md:w-1/3">
                            <Label>Diamond Quality (Common for all)</Label>
                            <Select
                                value={diamondDetails[0]?.quality || "EF-VVS"}
                                onValueChange={(val) => {
                                    // Update all rows to have this quality
                                    const newDetails = diamondDetails.map(d => ({ ...d, quality: val }));
                                    setDiamondDetails(newDetails);
                                }}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EF-VVS">EF-VVS</SelectItem>
                                    <SelectItem value="EF-IF-VVS1">EF-IF-VVS1</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {diamondDetails.map((diamond, index) => (
                            <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end border-b pb-4 last:border-0 pt-4">
                                <div className="space-y-2">
                                    <Label>Slab</Label>
                                    <Select value={diamond.slab} onValueChange={(val) => updateDiamondRow(index, 'slab', val)}>
                                        <SelectTrigger><SelectValue placeholder="Select Slab" /></SelectTrigger>
                                        <SelectContent>
                                            {diamondSlabs.map(s => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Count</Label>
                                    <Input
                                        type="number"
                                        value={diamond.count}
                                        onChange={(e) => updateDiamondRow(index, 'count', e.target.value)}
                                        placeholder="Qty"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Weight (Carats)</Label>
                                    <Input
                                        type="number" step="0.01"
                                        value={diamond.weight}
                                        onChange={(e) => updateDiamondRow(index, 'weight', e.target.value)}
                                        placeholder="Cts"
                                    />
                                </div>

                                <div className="pb-1">
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeDiamondRow(index)} disabled={diamondDetails.length === 1}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 4. Color Stone Details */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Color Stone Details</h3>
                            <Button type="button" variant="outline" size="sm" onClick={addColorStoneRow}>
                                <Plus className="w-4 h-4 mr-2" /> Add Stone
                            </Button>
                        </div>

                        {colorStoneDetails.map((stone, index) => (
                            <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end border-b pb-4 last:border-0">
                                <div className="space-y-2">
                                    <Label>Quality</Label>
                                    <Select value={stone.quality} onValueChange={(val) => updateColorStoneRow(index, 'quality', val)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Natural Gems">Natural Gems</SelectItem>
                                            <SelectItem value="Semi Precious">Semi Precious</SelectItem>
                                            <SelectItem value="Synthetic">Synthetic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input
                                        value={stone.description}
                                        onChange={(e) => updateColorStoneRow(index, 'description', e.target.value)}
                                        placeholder="e.g. Ruby"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Count</Label>
                                    <Input
                                        type="number"
                                        value={stone.count}
                                        onChange={(e) => updateColorStoneRow(index, 'count', e.target.value)}
                                        placeholder="Qty"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Weight (Carats)</Label>
                                    <Input
                                        type="number" step="0.01"
                                        value={stone.weight}
                                        onChange={(e) => updateColorStoneRow(index, 'weight', e.target.value)}
                                        placeholder="Cts"
                                    />
                                </div>

                                <div className="pb-1">
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeColorStoneRow(index)} disabled={colorStoneDetails.length === 1}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 5. Images */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <h3 className="text-lg font-semibold">Product Images</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Existing Images */}
                            {existingImages.map((src, index) => (
                                <div key={`existing-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border">
                                    <img src={getImageUrl(src)} alt="Existing" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {/* New Preview Images */}
                            {previewImages.map((src, index) => (
                                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
                                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">Upload Images</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* 6. Pricing Details (New) */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <h3 className="text-lg font-semibold">Pricing Parameters</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label>Making Charges (₹/g)</Label>
                                <Input
                                    type="number"
                                    value={pricingDetails.makingChargesPerGram}
                                    onChange={(e) => setPricingDetails({ ...pricingDetails, makingChargesPerGram: e.target.value })}
                                    placeholder="1000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mt-2">
                            <Label>Wastage % (Value Addition)</Label>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {Object.keys(pricingDetails.wastagePercentage).map((kt) => (
                                    <div key={kt} className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">{kt.toUpperCase()}</Label>
                                        <Input
                                            type="number"
                                            value={(pricingDetails.wastagePercentage as any)[kt]}
                                            onChange={(e) => setPricingDetails({
                                                ...pricingDetails,
                                                wastagePercentage: {
                                                    ...pricingDetails.wastagePercentage,
                                                    [kt]: e.target.value
                                                }
                                            })}
                                            placeholder="%"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {id ? 'Update Product' : 'Create Product'}
                </Button>
            </form>
        </div>
    );
};

export default AddProduct;
