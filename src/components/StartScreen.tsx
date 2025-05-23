import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
//import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import './StartScreen.css'
import { useState } from "react"
import { Eye, EyeOff, AlertCircle, X } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";


const StartScreen: React.FC = () => {

    const [switchOn, {/*setSwitchOn*/}] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [alertMessageIN, setAlertMessageIN] = useState<string | null>(null);
    const [alertMessageUP, setAlertMessageUP] = useState<string | null>(null);
    const [successMessageIN, setSuccessMessageIN] = useState<string | null>(null);
    const [successMessageUP, setSuccessMessageUP] = useState<string | null>(null);

    const navigate = useNavigate();
    const { setUser } = useUser();

    const showAlertSignIn = (message: string) => {
        setSuccessMessageIN(null);
        setAlertMessageIN(message);
    };

    const showAlertSignUp = (message: string) => {
        setSuccessMessageUP(null);
        setAlertMessageUP(message);
    };

    const showSuccessSignIn = (message: string) => {
        setAlertMessageIN(null);
        setSuccessMessageIN(message);
    };

    const showSuccessSignUp = (message: string) => {
        setAlertMessageUP(null);
        setSuccessMessageUP(message);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5036/api/user/login", {
                username,
                password
            });
            if (response.data) { } //warning
            showSuccessSignIn("Login successful.");
            const response2 = await axios.get(`http://localhost:5036/api/user/${username}`);
            const user = response2.data;
            setUser({
                username: username,
                avatar: user.avatar,
                isAdmin: user.isAdmin,
                cartId: user.cartId,
            });

            navigate("/main");
        } catch (error: any) {
            if (error.response?.status === 404) {
                showAlertSignIn("User not found.")
            } else if (error.response?.status === 401) {
                showAlertSignIn("Invalid password.")
            } else {
                showAlertSignIn("An error has occured. Please try again.")
            }
        }
    }

    const handleRegister = async () => {
        if (!newUsername || !newPassword) {
            showAlertSignUp("Username and password are required.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5036/api/user/register", {
                username: newUsername,
                password: newPassword,
                isAdmin: switchOn,
                avatar: "https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg"
            });
            if (response.data) { } //warning
            setNewUsername("");
            setNewPassword("");

            showSuccessSignUp("Account created successfully.");
        } catch (error: any) {
            if (error.response?.status === 400) {
                showAlertSignUp(error.response.data);
            } else {
                showAlertSignUp("An error occurred. Please try again.");
            }
        }
    }

    return (
        <div className="start-screen">
            <Tabs defaultValue="sign-in" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sign-in">Sign in</TabsTrigger>
                    <TabsTrigger value="sign-up">Sign up</TabsTrigger>
                </TabsList>
                <TabsContent value="sign-in">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sign in</CardTitle>
                            <CardDescription>Enter your username and password to continue.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {alertMessageIN && (
                                <Alert variant="destructive" className="border border-red-500">
                                    <AlertCircle />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{alertMessageIN}</AlertDescription>
                                    <Button
                                        variant="ghost"
                                        className="absolute right-2 top-1 text-red-500 p-0 hover:bg-transparent"
                                        onClick={() => setAlertMessageIN(null)}
                                    >
                                        <X size={5} />
                                    </Button>
                                </Alert>
                            )}
                            {successMessageIN && (
                                <Alert className="border-green-500 bg-green-50 text-green-800">
                                    <AlertCircle className="text-green-500" />
                                    <AlertDescription className="text-green-800">{successMessageIN}</AlertDescription>
                                    <Button
                                        variant="ghost"
                                        className="absolute right-2 top-1 text-green-800 p-0 hover:bg-transparent"
                                        onClick={() => setSuccessMessageIN(null)}
                                    >
                                        <X size={5} />
                                    </Button>
                                </Alert>
                            )}
                            <div className="space-y-1">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={passwordVisible ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                        onMouseDown={() => setPasswordVisible(true)}
                                        onMouseUp={() => setPasswordVisible(false)}
                                        onMouseLeave={() => setPasswordVisible(false)}
                                    >
                                        {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="button-center" onClick={handleLogin}>Sign in</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="sign-up">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sign up</CardTitle>
                            <CardDescription>Enter a username and password to create an account.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {alertMessageUP && (
                                <Alert variant="destructive" className="border border-red-500">
                                    <AlertCircle />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{alertMessageUP}</AlertDescription>
                                    <Button
                                        variant="ghost"
                                        className="absolute right-2 top-1 text-red-500 p-0 hover:bg-transparent"
                                        onClick={() => setAlertMessageUP(null)}
                                    >
                                        <X size={5} />
                                    </Button>
                                </Alert>
                            )}
                            {successMessageUP && (
                                <Alert className="border-green-500 bg-green-50 text-green-800">
                                    <AlertCircle className="text-green-500" />
                                    <AlertDescription className="text-green-800">{successMessageUP}</AlertDescription>
                                    <Button
                                        variant="ghost"
                                        className="absolute right-2 top-1 text-green-800 p-0 hover:bg-transparent"
                                        onClick={() => setSuccessMessageUP(null)}
                                    >
                                        <X size={5} />
                                    </Button>
                                </Alert>
                            )}
                            <div className="space-y-1">
                                <Label htmlFor="new-username">Username</Label>
                                <Input
                                    id="new-username"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new-password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="new-password"
                                        type={passwordVisible ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                        onMouseDown={() => setPasswordVisible(true)}
                                        onMouseUp={() => setPasswordVisible(false)}
                                        onMouseLeave={() => setPasswordVisible(false)}
                                    >
                                        {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            {/* <div className="flex items center space-x-2 switch-container">
                                <Switch
                                    id="account-type"
                                    checked={switchOn}
                                    onCheckedChange={(checked) => setSwitchOn(checked)}
                                />
                                <Label htmlFor="account-type">
                                    {switchOn ? "Admin account" : "Customer account"}
                                </Label>
                            </div> */}
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="button-center"
                                onClick={handleRegister}
                            >
                                Sign up
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div >
    );
};

export default StartScreen;