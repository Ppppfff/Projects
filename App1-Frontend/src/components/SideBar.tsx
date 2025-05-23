import { Sidebar, SidebarGroupAction, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuAction, SidebarFooter } from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import axios from "axios";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Footer } from "./Footer";
import { useUser } from "@/context/UserContext";
import { useFilter } from "@/context/FilterContext";
import { Separator } from "./ui/separator";
import { NavFilters } from "./NavFilters";


interface Department {
    id: number;
    name: string;
}

interface SideBarProps {
    onDepartmentSelect: (departmentId: number) => void;
    selectedDepartment: number | null;
}

export function SideBar({ onDepartmentSelect, selectedDepartment }: SideBarProps) {


    const [departments, setDepartments] = useState<Department[]>([]);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [editDepartmentName, setEditDepartmentName] = useState("")
    const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);
    const [addingDepartment, setAddingDepartment] = useState(false);
    const [addDepartmentName, setAddDepartmentName] = useState("");
    const { user } = useUser();
    const { setFilter } = useFilter();


    useEffect(() => {
        axios
            .get("http://localhost:5036/api/Department/GetDepartment")
            .then((response) => {
                const sortedDepartments = response.data.sort((a: Department, b: Department) =>
                    a.name.localeCompare(b.name));
                setDepartments(sortedDepartments);
            })
            .catch((error) => {
                console.error("Error fetching departments", error);
            });
        setFilter({ minPrice: 0, maxPrice: 3000, sortBy: "nameAsc" });
    }, []);

    const openEditDialog = (dept: Department) => {
        setEditingDepartment(dept)
        setEditDepartmentName(dept.name)
    }

    const closeEditDialog = () => {
        setEditingDepartment(null)
    }

    const openDeleteDialog = (dept: Department) => {
        setDeletingDepartment(dept);
    }

    const closeDeleteDialog = () => {
        setDeletingDepartment(null)
    }

    const handlEditDepartment = () => {

        if (!editDepartmentName.trim() || !editingDepartment) return;

        axios
            .put("http://localhost:5036/api/Department/UpdateDepartment", {
                id: editingDepartment.id,
                name: editDepartmentName,
            })
            .then((res) => {
                // Update links state with edited department
                setDepartments((prevDepts) =>
                    prevDepts.map((dep) =>
                        dep.id === res.data.id ? res.data : dep
                    )
                        .sort((a: Department, b: Department) =>
                            a.name.localeCompare(b.name))
                );
            })
            .catch((err) =>
                console.error("Error updating department:", err)
            );
        closeEditDialog();
    };

    const handleDeleteDepartment = () => {
        if (!deletingDepartment) return;
        axios.delete(`http://localhost:5036/api/Department/DeleteDepartment/${deletingDepartment?.id}`)
            .then(() => {
                setDepartments((prev) => prev.filter((d) => d.id !== deletingDepartment.id)
                    .sort((a: Department, b: Department) =>
                        a.name.localeCompare(b.name))
                );
                closeDeleteDialog();
            })
            .catch((err) => {
                console.error("Error deleting items or department", err);
            });
    };

    const closeAddingDialog = () => {
        setAddingDepartment(false);
    }

    const handlCreateDepartment = () => {
        if (!addDepartmentName.trim()) {
            return;
        }
        axios.post("http://localhost:5036/api/Department/CreateDepartment", {
            name: addDepartmentName,
        }).then((res) => {
            setDepartments((prev) => [...prev, res.data]);
            setAddDepartmentName("");
        }).catch(err => console.error("Error creating department", err));
        closeAddingDialog();
    }

    return (
        <>
            <Sidebar>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Departments</SidebarGroupLabel>
                        {user?.isAdmin &&
                            <SidebarGroupAction title="Add Department" onClick={() => setAddingDepartment(true)}>
                                <Plus />
                                <span
                                    className="sr-only"
                                    onClick={() => setAddingDepartment(true)}
                                >
                                    Add Department
                                </span>
                            </SidebarGroupAction>
                        }
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {departments.map((d) => (
                                    <SidebarMenuItem key={d.id}>
                                        <SidebarMenuButton
                                            asChild
                                            onClick={() => onDepartmentSelect(d.id)}
                                            className={`px-4 py-2 rounded-md transition ${selectedDepartment === d.id ? "bg-gray-300 dark:bg-gray-500" : "bg-transparent"
                                                }`}
                                        >
                                            <span>{d.name}</span>
                                        </SidebarMenuButton>
                                        {user?.isAdmin &&
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <SidebarMenuAction>
                                                        <MoreHorizontal />
                                                    </SidebarMenuAction>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent side="right" align="start">
                                                    <DropdownMenuItem onClick={() => openEditDialog(d)}>
                                                        <span>Edit Department</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openDeleteDialog(d)}>
                                                        <span>Delete Department</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        }
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <div className="px-3">
                        <Separator />
                    </div>
                    <NavFilters />
                </SidebarContent>
                <SidebarFooter>
                    <Footer />
                </SidebarFooter>
            </Sidebar>

            {editingDepartment && (
                <Dialog open={true} onOpenChange={(isOpen) => !isOpen && closeEditDialog()}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Department</DialogTitle>
                            <DialogDescription>
                                Change the department name below and save your changes.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="departmentName" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="departmentName"
                                    value={editDepartmentName}
                                    onChange={(e) => setEditDepartmentName(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handlEditDepartment}>Save changes</Button>
                            <Button variant="ghost" onClick={closeEditDialog}>
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {deletingDepartment && (
                <Dialog open={true} onOpenChange={(isOpen) => !isOpen && closeDeleteDialog()}>
                    <DialogContent className="sm:max-w-[425px]" aria-describedby="delete-description">
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to delete this department?</DialogTitle>
                        </DialogHeader>
                        <DialogDescription id="delete-description">
                            This action cannot be undone.
                        </DialogDescription>
                        <DialogFooter>
                            <Button onClick={handleDeleteDepartment}>Delete department</Button>
                            <Button variant="ghost" onClick={closeDeleteDialog}>
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {addingDepartment && (
                <Dialog open={true} onOpenChange={(isOpen) => !isOpen && closeAddingDialog()}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create Department</DialogTitle>
                            <DialogDescription>
                                Choose the name of the new department.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="departmentName" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="departmentName"
                                    value={addDepartmentName}
                                    onChange={(e) => setAddDepartmentName(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handlCreateDepartment}>Confirm</Button>
                            <Button variant="ghost" onClick={closeAddingDialog}>
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}