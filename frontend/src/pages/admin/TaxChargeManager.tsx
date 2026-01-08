import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/config";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface TaxCharge {
    _id: string;
    karat: string;
    vatPercent: number;
    makingChargePerGram: number;
}

const TaxChargeManager = () => {
    const [charges, setCharges] = useState<TaxCharge[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCharge, setEditingCharge] = useState<TaxCharge | null>(null);
    const [formData, setFormData] = useState({
        vatPercent: '',
        makingChargePerGram: ''
    });

    useEffect(() => {
        fetchCharges();
    }, []);

    const fetchCharges = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/tax-charges`);
            const data = await res.json();
            setCharges(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch tax & charges');
        }
    };

    const openEdit = (charge: TaxCharge) => {
        setEditingCharge(charge);
        setFormData({
            vatPercent: charge.vatPercent.toString(),
            makingChargePerGram: charge.makingChargePerGram.toString()
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCharge) return;
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/tax-charges/${editingCharge._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    vatPercent: Number(formData.vatPercent),
                    makingChargePerGram: Number(formData.makingChargePerGram)
                })
            });

            if (!res.ok) throw new Error('Failed to update');

            toast.success('Updated successfully');
            fetchCharges();
            setIsDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast.error('Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif font-bold text-primary">Tax & Making Charges Manager</h1>

            <div className="bg-white rounded-lg shadow border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Gold Karat</TableHead>
                            <TableHead>Value Added Tax (VAT %)</TableHead>
                            <TableHead>Making Charges (₹/g)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {charges.map((charge) => (
                            <TableRow key={charge._id}>
                                <TableCell className="font-medium">{charge.karat}</TableCell>
                                <TableCell>{charge.vatPercent}%</TableCell>
                                <TableCell>₹{charge.makingChargePerGram.toLocaleString()}/g</TableCell>
                                <TableCell className="text-right">
                                    <Dialog open={isDialogOpen && editingCharge?._id === charge._id} onOpenChange={(open) => !open && setIsDialogOpen(false)}>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(charge)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Charges: {charge.karat}</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div>
                                                    <Label>VAT Percentage (%)</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.vatPercent}
                                                        onChange={(e) => setFormData({ ...formData, vatPercent: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Making Charges (Per Gram)</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.makingChargePerGram}
                                                        onChange={(e) => setFormData({ ...formData, makingChargePerGram: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <Button type="submit" className="w-full" disabled={loading}>
                                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Update Charges
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TaxChargeManager;
