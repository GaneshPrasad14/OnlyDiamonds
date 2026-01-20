import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";
import { Pencil, Trash2, Plus, FolderTree, Network } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Category {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    parent?: { _id: string; name: string } | null;
}

const CategoryManager = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        parent: "none",
    });

    // Dialog Mode State
    const [dialogMode, setDialogMode] = useState<"main" | "sub" | "edit">("main");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/categories`);
            const data = await response.json();
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const url = editingCategory
                ? `${API_BASE_URL}/api/categories/${editingCategory._id}`
                : `${API_BASE_URL}/api/categories`;

            const method = editingCategory ? "PUT" : "POST";

            // Prepare JSON payload instead of FormData since we removed image upload
            const payload: any = {
                name: formData.name,
                description: formData.description,
            };

            if (formData.parent !== "none") {
                payload.parent = formData.parent;
            } else {
                payload.parent = null; // Backend handles null/none logic, but let's send null explicitly
            }

            // For sub-category mode, validation
            if (dialogMode === 'sub' && !editingCategory && (formData.parent === 'none' || !formData.parent)) {
                toast.error("Please select a parent category for the sub-category");
                return;
            }


            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save category");
            }

            toast.success(editingCategory ? "Category updated" : "Category created");
            fetchCategories();
            setIsDialogOpen(false);
            resetForm();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure? This will delete the category.")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete category");
            }

            setCategories(categories.filter((cat) => cat._id !== id));
            toast.success("Category deleted");
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    const resetForm = () => {
        setFormData({ name: "", description: "", parent: "none" });
        setEditingCategory(null);
        setDialogMode("main");
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setDialogMode("edit");
        setFormData({
            name: category.name,
            description: category.description || "",
            parent: category.parent?._id || "none",
        });
        setIsDialogOpen(true);
    };

    const handleCreateMain = () => {
        resetForm();
        setDialogMode("main");
        setFormData(prev => ({ ...prev, parent: "none" }));
        setIsDialogOpen(true);
    }

    const handleCreateSub = () => {
        resetForm();
        setDialogMode("sub");
        setIsDialogOpen(true);
    }


    if (loading) return <div>Loading...</div>;

    const getDialogTitle = () => {
        if (editingCategory) return "Edit Category";
        if (dialogMode === "sub") return "Add Sub-Category";
        return "Add Main Category";
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-primary">Categories</h1>
                <div className="flex gap-2">
                    <Button onClick={handleCreateMain} variant="outline">
                        <Plus className="mr-2 h-4 w-4" /> Add Main Category
                    </Button>
                    <Button onClick={handleCreateSub}>
                        <Network className="mr-2 h-4 w-4" /> Add Sub-Category
                    </Button>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{getDialogTitle()}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder={dialogMode === 'sub' ? "e.g. Diamond Rings" : "e.g. Rings"}
                                />
                            </div>

                            {/* Parent Select - Show ONLY if NOT creating a main category */}
                            {dialogMode !== 'main' && (
                                <div>
                                    <Label>Parent Category</Label>
                                    <Select
                                        value={formData.parent}
                                        onValueChange={(value) => setFormData({ ...formData, parent: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select parent category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Only show 'None' option if we are editing, because 'Add Sub' implies parent is mandatory 
                                                Actually, if we are in 'sub' mode, we shouldn't allow 'none'. 
                                                If editing, we allow changing to 'none' to promote to top level.
                                            */}
                                            {dialogMode === 'edit' && <SelectItem value="none">None (Top Level)</SelectItem>}

                                            {categories
                                                .filter((c) => c._id !== editingCategory?._id) // Prevent selecting self as parent
                                                .filter((c) => !c.parent) // Only show Main Categories (no parent)
                                                .map((category) => (
                                                    <SelectItem key={category._id} value={category._id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    {dialogMode === 'sub' && <p className="text-xs text-muted-foreground mt-1">Select the main category this belongs to.</p>}
                                </div>
                            )}

                            <div>
                                <Label>Description</Label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            {/* Image upload removed as per requirement */}

                            <Button type="submit" className="w-full">
                                {editingCategory ? "Update" : "Create"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Parent</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category._id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center">
                                        <FolderTree className="mr-2 h-4 w-4 text-gray-400" />
                                        {category.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs ${category.parent ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                        {category.parent ? 'Sub-Category' : 'Main Category'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {category.parent ? (
                                        <span className="font-medium text-gray-700">
                                            {category.parent.name}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs italic">-</span>
                                    )}
                                </TableCell>
                                <TableCell>{category.description || "-"}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => handleDelete(category._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
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

export default CategoryManager;
