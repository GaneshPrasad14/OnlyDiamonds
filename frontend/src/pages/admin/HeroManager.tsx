import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface HeroImage {
    _id: string;
    title: string;
    titleColor: string;
    description: string;
    descriptionColor: string;
    image: string;
    order: number;
    isActive: boolean;
}

const HeroManager = () => {
    const [images, setImages] = useState<HeroImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingImage, setEditingImage] = useState<HeroImage | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        titleColor: '#FFFFFF',
        description: '',
        descriptionColor: '#FFFFFF',
        order: 0,
        isActive: true
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/hero/admin', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setImages(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch hero images');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData({ ...formData, isActive: checked });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFile(e.target.files[0]);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', titleColor: '#FFFFFF', description: '', descriptionColor: '#FFFFFF', order: 0, isActive: true });
        setImageFile(null);
        setEditingImage(null);
        setIsDialogOpen(false);
    };

    const openEdit = (img: HeroImage) => {
        setEditingImage(img);
        setFormData({
            title: img.title || '',
            titleColor: img.titleColor || '#FFFFFF',
            description: img.description || '',
            descriptionColor: img.descriptionColor || '#FFFFFF',
            order: img.order,
            isActive: img.isActive
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const payload = new FormData();
            payload.append('title', formData.title);
            payload.append('titleColor', formData.titleColor);
            payload.append('description', formData.description);
            payload.append('descriptionColor', formData.descriptionColor);
            payload.append('order', String(formData.order));
            payload.append('isActive', String(formData.isActive));
            if (imageFile) {
                payload.append('image', imageFile);
            }

            const url = editingImage
                ? `http://localhost:5000/api/hero/${editingImage._id}`
                : 'http://localhost:5000/api/hero';

            const method = editingImage ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` },
                body: payload
            });

            if (!res.ok) throw new Error('Failed to save');

            toast.success(editingImage ? 'Updated successfully' : 'Created successfully');
            fetchImages();
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/hero/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Deleted successfully');
            fetchImages();
        } catch (error) {
            console.error(error);
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-primary">Hero Section Manager</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => {
                            setEditingImage(null);
                            setFormData({ title: '', titleColor: '#FFFFFF', description: '', descriptionColor: '#FFFFFF', order: 0, isActive: true });
                        }}>
                            <Plus className="w-4 h-4 mr-2" /> Add New Banner
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingImage ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Label>Title (Optional)</Label>
                                    <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter title" />
                                </div>
                                <div className="w-20">
                                    <Label>Color</Label>
                                    <Input type="color" name="titleColor" value={formData.titleColor} onChange={handleInputChange} className="h-10 px-1 py-1" />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Label>Description (Optional)</Label>
                                    <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter description" />
                                </div>
                                <div className="w-20">
                                    <Label>Color</Label>
                                    <Input type="color" name="descriptionColor" value={formData.descriptionColor} onChange={handleInputChange} className="h-10 px-1 py-1" />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Label>Order</Label>
                                    <Input type="number" name="order" value={formData.order} onChange={handleInputChange} />
                                </div>
                                <div className="flex items-center gap-2 pt-8">
                                    <Label>Active</Label>
                                    <Switch checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                                </div>
                            </div>
                            <div>
                                <Label>Image (Required)</Label>
                                <Input type="file" accept="image/*" onChange={handleFileChange} />
                                {editingImage && !imageFile && (
                                    <p className="text-xs text-muted-foreground mt-1">Leave empty to keep current image</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingImage ? 'Update' : 'Create'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Preview</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {images.map((img) => (
                            <TableRow key={img._id}>
                                <TableCell>
                                    <img src={`http://localhost:5000/${img.image}`} alt={img.title} className="w-16 h-10 object-cover rounded" />
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{img.title}</div>
                                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{img.description}</div>
                                </TableCell>
                                <TableCell>{img.order}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${img.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {img.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openEdit(img)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(img._id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default HeroManager;
