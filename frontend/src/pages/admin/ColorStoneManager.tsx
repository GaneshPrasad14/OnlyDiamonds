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
import { Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ColorStone {
    _id: string;
    type: string;
    pricePerCarat: number;
}

const ColorStoneManager = () => {
    const [stones, setStones] = useState<ColorStone[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingStone, setEditingStone] = useState<ColorStone | null>(null);
    const [price, setPrice] = useState('');

    useEffect(() => {
        fetchStones();
    }, []);

    const fetchStones = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/color-stones');
            const data = await res.json();
            setStones(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch color stones');
        }
    };

    const openEdit = (stone: ColorStone) => {
        setEditingStone(stone);
        setPrice(stone.pricePerCarat.toString());
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStone) return;
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/color-stones/${editingStone._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ pricePerCarat: Number(price) })
            });

            if (!res.ok) throw new Error('Failed to update');

            toast.success('Updated successfully');
            fetchStones();
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
            <h1 className="text-3xl font-serif font-bold text-primary">Color Stone Manager</h1>

            <div className="bg-white rounded-lg shadow border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Stone Type</TableHead>
                            <TableHead>Price (Per Carat)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stones.map((stone) => (
                            <TableRow key={stone._id}>
                                <TableCell className="font-medium">{stone.type}</TableCell>
                                <TableCell>₹{stone.pricePerCarat.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    <Dialog open={isDialogOpen && editingStone?._id === stone._id} onOpenChange={(open) => !open && setIsDialogOpen(false)}>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={() => openEdit(stone)}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Price: {stone.type}</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div>
                                                    <Label>Price Per Carat (₹)</Label>
                                                    <Input
                                                        type="number"
                                                        value={price}
                                                        onChange={(e) => setPrice(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <Button type="submit" className="w-full" disabled={loading}>
                                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Update Price
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

export default ColorStoneManager;
