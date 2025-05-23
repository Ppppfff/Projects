import { ChevronsUpDown, Image, KeyRound, LogOut, UserPen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import axios from "axios";
import { AvatarSettingsModal } from "./AvatarSettingsModal";
import { EditUsernameSettingsModal } from "./EditUsernameSettingsModal";
import { PasswordChangeModal } from "./PasswordChangeModal";
import { toast } from "sonner";

export function Footer() {

    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);
    const [avatarModalOpen, setAvatarModalOpen] = useState(false);
    const [usernameModalOpen, setUsernameModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);

    const handleLogout = () => {
        setLoggingOut(false);
        setUser(null);
        navigate("/login");
    };

    const closeLogOutDialog = () => {
        setLoggingOut(false);
        console.log(user?.username);
    }

    const updateAvatar = async (avatarUrl: string, user: any, setUser: any) => {
        if (!user) {
            console.error("User is not logged in.");
            return;
        }

        try {
            await axios.put(`http://localhost:5036/api/user/UpdateAvatar`, {
                username: user.username,
                avatar: avatarUrl
            });

            // Update the user context
            setUser({
                ...user,
                avatar: avatarUrl
            });

            toast("Success", {
                description: "Your avatar has been updated successfully"
            })
        } catch (error) {
            console.error("Error updating avatar:", error);
        }
    };

    const updateUsername = async (newUsername: string) => {
        if (!user) {
            console.error("User is not logged in.");
            return;
        }

        try {
            await axios.put("http://localhost:5036/api/user/UpdateUsername", {
                username: user.username,
                newUsername: newUsername
            });

            // Update the user context
            setUser({
                ...user,
                username: newUsername
            });

            toast("Success", {
                description: "Username updated successfully. Your new username is \"" + newUsername + "\""
            })
        } catch (error) {
            toast("Error", {
                description: "Error updating your username. Please try again."
            })
        }
    };

    const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
        if (!user) {
            console.error("User is not logged in.");
            return;
        }

        try {
            await axios.put("http://localhost:5036/api/user/UpdatePassword", {
                username: user.username,
                password: oldPassword,
                changed: newPassword,
            });

            toast("Success", {
                description: "Your password has been updated successfully"
            })
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                console.error("Incorrect current password.");
            } else {
                console.error("Error updating password:", error);
            }
        }
    };


    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user?.avatar} />
                                    <AvatarFallback className="rounded-lg">NS</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user?.username}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            side="right"
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user?.avatar || "../res/placeholder.svg"} alt={user?.username} />
                                        <AvatarFallback className="rounded-lg">
                                            {user?.username
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user?.username}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => setUsernameModalOpen(true)}>
                                    <UserPen />
                                    Edit username
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setPasswordModalOpen(true)}>
                                    <KeyRound />
                                    Change password
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setAvatarModalOpen(true)}>
                                    <Image />
                                    Avatar
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => setLoggingOut(true)}
                            >
                                <LogOut className="mr-2 text-red-600" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            <EditUsernameSettingsModal
                isOpen={usernameModalOpen}
                onClose={() => setUsernameModalOpen(false)}
                username={(user) ? user.username : ""}
                onUpdateUsername={(newUsername) => updateUsername(newUsername)}
            />

            <AvatarSettingsModal
                isOpen={avatarModalOpen}
                onClose={() => setAvatarModalOpen(false)}
                avatar={(user) ? user.avatar : ""}
                onUpdateAvatar={(avatarUrl) => updateAvatar(avatarUrl, user, setUser)}
            />

            <PasswordChangeModal
                isOpen={passwordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
                onPasswordChange={handlePasswordChange}
            />


            {loggingOut && (
                <Dialog open={true} onOpenChange={(isOpen) => !isOpen && closeLogOutDialog()}>
                    <DialogContent className="sm:max-w-[425px]" aria-describedby="delete-description">
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to log out?</DialogTitle>
                        </DialogHeader>
                        <DialogDescription id="delete-description">
                            You will return to the start screen.
                        </DialogDescription>
                        <DialogFooter>
                            <Button onClick={handleLogout}>Log out</Button>
                            <Button variant="ghost" onClick={closeLogOutDialog}>
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

        </>
    )
}