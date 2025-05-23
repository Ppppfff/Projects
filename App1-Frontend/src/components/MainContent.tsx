import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useFilter } from "@/context/FilterContext";
import { SideBar } from "./SideBar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { ItemCard } from "./ItemCard";
import { Separator } from "./ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import axios from "axios";
import { ChevronDown, Search, ShoppingCart, PlusCircle } from "lucide-react";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { EditItemModal } from "./EditItemModal";
import { CartDrawer } from "./CartDrawer";

export interface Item {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    department_id: number;
}

export interface CartItem {
    id: number;
    name: string;
    cartId: number;
    itemId: number;
    price: number;
    quantity: number;
    imageUrl: string;
}

export function MainContent() {
    const { user } = useUser();
    const { filter } = useFilter();
    const [items, setItems] = useState<Item[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalCartItems, setTotalCartItems] = useState(0);

    // When a department is selected
    const handleDepartmentSelect = (departmentId: number) => {
        setSelectedDepartment(departmentId);
        fetchPaginatedItems(departmentId, currentPage, itemsPerPage, debouncedSearchQuery);
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (selectedDepartment) {
            setCurrentPage(1);
            fetchTotalItemsCount(selectedDepartment, debouncedSearchQuery);
            fetchPaginatedItems(selectedDepartment, 1, itemsPerPage, debouncedSearchQuery);

        }
    }, [debouncedSearchQuery, selectedDepartment]);



    const fetchTotalItemsCount = (departmentId: number, debouncedSearchQuery = "") => {
        axios
            .get(`http://localhost:5036/api/Item/GetItemsCount/${departmentId}`, {
                params: { searchQuery: debouncedSearchQuery, minPrice: filter?.minPrice, maxPrice: filter?.maxPrice },
            })
            .then((response) => {
                const count = response.data;
                setTotalItemsCount(count);
                setTotalPages(Math.ceil(count / itemsPerPage));
            })
            .catch((err) => {
                console.error("Error fetching total items count:", err);
            });
    };

    const fetchPaginatedItems = (departmentId: number, pageNb = 1, pageSize = 10, debouncedSearchQuery = "") => {
        axios.
            get(`http://localhost:5036/api/Item/GetItemsByDepartment/${departmentId}`, {
                params: {
                    pageNb, pageSize, searchQuery: debouncedSearchQuery,
                    minPrice: filter?.minPrice, maxPrice: filter?.maxPrice, sortBy: filter?.sortBy
                },
            })
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => {
                console.error("Error fetching items", error);
            });
    };

    const handleItemsPerPageChange = (ipp: number) => {
        setItemsPerPage(ipp);
        if (selectedDepartment) {
            fetchPaginatedItems(selectedDepartment, 1, ipp, debouncedSearchQuery);
            setCurrentPage(1);
        }
    }

    useEffect(() => {
        if (selectedDepartment) {
            setCurrentPage(1);
            fetchTotalItemsCount(selectedDepartment, debouncedSearchQuery);
            fetchPaginatedItems(selectedDepartment, 1, itemsPerPage, debouncedSearchQuery);
        }
    }, [filter]);


    useEffect(() => {
        if (selectedDepartment) {
            setCurrentPage(1);
            fetchTotalItemsCount(selectedDepartment, debouncedSearchQuery);
            fetchPaginatedItems(selectedDepartment, 1, itemsPerPage, debouncedSearchQuery);
        }
    }, [itemsPerPage]);

    useEffect(() => {
        if (selectedDepartment)
            fetchPaginatedItems(selectedDepartment, currentPage, itemsPerPage, debouncedSearchQuery);
    }, [currentPage]);

    const updateItemsAfterEdit = () => {
        if (selectedDepartment) {
            fetchPaginatedItems(selectedDepartment, currentPage, itemsPerPage, debouncedSearchQuery);
            fetchTotalItemsCount(selectedDepartment, debouncedSearchQuery)
        }
    }

    const fetchCartItems = async () => {
        try {
            const response = await axios.get<CartItem[]>(
                `http://localhost:5036/api/Cart/${user?.cartId}/items`
            );
            setCartItems(response.data);
        } catch (error) {
            console.error("Failed to fetch cart items:", error);
        }
    };

    const increaseQuantity = async (itemId: number) => {
        await axios.post(`http://localhost:5036/api/Cart/${user?.cartId}/add-item`, null, {
            params: {
                itemId,
                quantity: 1,
            },
        });
        fetchCartItems();
    };

    // Decrease Quantity
    const decreaseQuantity = async (itemId: number) => {
        await axios.post(`http://localhost:5036/api/Cart/${user?.cartId}/add-item`, null, {
            params: {
                itemId,
                quantity: -1,
            },
        });
        fetchCartItems();
    };

    // Remove Item
    const removeItem = async (itemId: number) => {
        await axios.delete(`http://localhost:5036/api/Cart/${user?.cartId}/remove-item`, {
            params: { itemId },
        });
        fetchCartItems();
    };

    // Load Cart Items on Component Mount
    useEffect(() => {
        fetchCartItems();
    }, []);

    useEffect(() => {
        const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setTotalCartItems(total);
    }, [cartItems]);

    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
        <div className="flex h-screen">
            <SidebarProvider>
                <SideBar
                    onDepartmentSelect={handleDepartmentSelect}
                    selectedDepartment={selectedDepartment}
                />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbPage>Departments</BreadcrumbPage>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>All Items</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-bold">Items</h1>
                            </div>
                            <div className="flex flex-wrap gap-3">

                                <div className="relative w-full sm:w-auto">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search items..."
                                        className="w-full pl-8 sm:w-[200px]"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="flex-shrink-0">
                                            {itemsPerPage} per page
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleItemsPerPageChange(5)}>5 per page</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleItemsPerPageChange(10)}>10 per page</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleItemsPerPageChange(15)}>15 per page</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleItemsPerPageChange(20)}>20 per page</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleItemsPerPageChange(25)}>25 per page</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {user?.isAdmin ? (
                                    <Button
                                        onClick={() => setAddItemDialogOpen(true)}
                                        className="flex-shrink-0"
                                        disabled={selectedDepartment === null}
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Item
                                    </Button>
                                ) : (
                                    <Button className="flex-shrink-0 relative" onClick={() => setIsCartOpen(true)}>
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        View Cart
                                        {totalCartItems > 0 && (
                                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                                {totalCartItems}
                                            </span>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-4">
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <ItemCard key={item.id} item={item} updateItemsAfterEdit={updateItemsAfterEdit} fetchCartItems={fetchCartItems} />
                                ))
                            ) : (
                                <p className="text-center col-span-full">No items found.</p>
                            )}
                        </div>
                        {items.length > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, items.length)} of{" "}
                                    {totalItemsCount} items
                                </div>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                                                }}
                                                isActive={currentPage !== 1}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        setCurrentPage(page)
                                                    }}
                                                    isActive={currentPage === page}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                                }}
                                                isActive={currentPage !== totalPages}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </div>
                </SidebarInset>

                {/* Product Form Modal */}
                <EditItemModal
                    isOpen={addItemDialogOpen}
                    onClose={() => setAddItemDialogOpen(false)}
                    onSave={() => updateItemsAfterEdit()}
                    item={null}
                    department_id={selectedDepartment ?? -1}
                />

                <CartDrawer
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    cartItems={cartItems}
                    increaseQuantity={increaseQuantity}
                    decreaseQuantity={decreaseQuantity}
                    removeItem={removeItem}
                />

            </SidebarProvider>
        </div >
    );
};

export default MainContent;