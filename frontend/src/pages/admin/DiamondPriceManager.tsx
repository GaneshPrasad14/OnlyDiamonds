import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DiamondSlab {
    _id: string;
    name: string;
    minWeight?: number;
    maxWeight?: number;
    vvsPrice: number;
    ifPrice: number;
}

const DiamondPriceManager = () => {
    const [slabs, setSlabs] = useState<DiamondSlab[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSlab, setEditingSlab] = useState<DiamondSlab | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        minWeight: '',
        maxWeight: '',
        vvsPrice: ''
    });

    useEffect(() => {
        fetchSlabs();
    }, []);

    const fetchSlabs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/diamond-slabs', {
                headers: { Authorization: `Bearer ${token}` } // Although endpoint is public in controller, protected routes need token
            });
            const data = await res.json();
            setSlabs(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch diamond slabs');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({ name: '', minWeight: '', maxWeight: '', vvsPrice: '' });
        setEditingSlab(null);
        setIsDialogOpen(false);
    };

    const openEdit = (slab: DiamondSlab) => {
        setEditingSlab(slab);
        setFormData({
            name: slab.name,
            minWeight: slab.minWeight?.toString() || '',
            maxWeight: slab.maxWeight?.toString() || '',
            vvsPrice: slab.vvsPrice.toString()
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const payload = {
                name: formData.name,
                minWeight: formData.minWeight ? Number(formData.minWeight) : undefined,
                maxWeight: formData.maxWeight ? Number(formData.maxWeight) : undefined,
                vvsPrice: Number(formData.vvsPrice)
            };

            const url = editingSlab
                ? `http://localhost:5000/api/diamond-slabs/${editingSlab._id}`
                : 'http://localhost:5000/api/diamond-slabs';

            const method = editingSlab ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to save');

            toast.success(editingSlab ? 'Updated successfully' : 'Created successfully');
            fetchSlabs();
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this slab?')) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/diamond-slabs/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Deleted successfully');
            fetchSlabs();
        } catch (error) {
            console.error(error);
            toast.error('Delete failed');
        }
    };

    // Calculate IF price for preview
    const calculatedIF = formData.vvsPrice ? Number(formData.vvsPrice) + 5000 : 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-primary">Diamond Price Manager</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { resetForm(); }}>
                            <Plus className="w-4 h-4 mr-2" /> Add New Slab
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingSlab ? 'Edit Slab' : 'Add New Slab'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Slab Name (e.g., "1 to 4 cent")</Label>
                                <Input name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter slab name" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Label>Min Weight (Optional)</Label>
                                    <Input type="number" step="0.01" name="minWeight" value={formData.minWeight} onChange={handleInputChange} />
                                </div>
                                <div className="flex-1">
                                    <Label>Max Weight (Optional)</Label>
                                    <Input type="number" step="0.01" name="maxWeight" value={formData.maxWeight} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg space-y-4 border">
                                <div>
                                    <Label>EF, VVS Price (₹)</Label>
                                    <Input type="number" name="vvsPrice" value={formData.vvsPrice} onChange={handleInputChange} required placeholder="Enter price for VVS" className="font-medium" />
                                </div>

                                <div>
                                    <Label className="text-muted-foreground">EF, IF-VVS1 Price (₹)</Label>
                                    <div className="h-10 px-3 py-2 bg-gray-100 rounded border text-gray-700 font-semibold cursor-not-allowed">
                                        {calculatedIF > 5000 ? `₹${calculatedIF.toLocaleString()}` : '---'}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">* Automatically calculated as VVS Price + ₹5,000</p>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingSlab ? 'Update' : 'Create'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Slab Name</TableHead>
                            <TableHead>Weight Range</TableHead>
                            <TableHead>EF, VVS Price</TableHead>
                            <TableHead>EF, IF-VVS1 Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {slabs.map((slab) => (
                            <TableRow key={slab._id}>
                                <TableCell className="font-medium">{slab.name}</TableCell>
                                <TableCell>
                                    {slab.minWeight !== undefined && slab.maxWeight !== undefined
                                        ? `${slab.minWeight} - ${slab.maxWeight} ct`
                                        : '-'}
                                </TableCell>
                                <TableCell>₹{slab.vvsPrice.toLocaleString()}</TableCell>
                                <TableCell className="text-primary font-medium">₹{slab.ifPrice.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openEdit(slab)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(slab._id)}>
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

export default DiamondPriceManager;
