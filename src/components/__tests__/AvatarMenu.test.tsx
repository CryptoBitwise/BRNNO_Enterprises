import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AvatarMenu from "../AvatarMenu";
import { AuthProvider } from "@/contexts/AuthContext";

// Mock the AuthContext
jest.mock("@/contexts/AuthContext", () => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
    useAuth: () => ({ user: { uid: "123", email: "test@example.com" } }),
}));

// Mock Firebase auth
jest.mock("@/lib/firebaseClient", () => ({
    authClient: {
        currentUser: {
            uid: "123",
            email: "test@example.com",
            getIdTokenResult: jest.fn().mockResolvedValue({
                claims: { admin: false }
            }),
        },
        onAuthStateChanged: jest.fn(),
    },
    analytics: null,
}));

describe("AvatarMenu", () => {
    it("renders avatar button", () => {
        render(
            <AuthProvider>
                <AvatarMenu />
            </AuthProvider>
        );

        const button = screen.getByLabelText(/account menu/i);
        expect(button).toBeInTheDocument();
    });

    it("shows menu items when clicked", async () => {
        render(
            <AuthProvider>
                <AvatarMenu />
            </AuthProvider>
        );

        const button = screen.getByLabelText(/account menu/i);
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/My Bookings/i)).toBeInTheDocument();
            expect(screen.getByText(/Account/i)).toBeInTheDocument();
            expect(screen.getByText(/Sign Out/i)).toBeInTheDocument();
        });
    });

    it("hides menu when clicking outside", async () => {
        render(
            <AuthProvider>
                <AvatarMenu />
            </AuthProvider>
        );

        const button = screen.getByLabelText(/account menu/i);
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText(/My Bookings/i)).toBeInTheDocument();
        });

        // Click outside
        fireEvent.click(document.body);

        await waitFor(() => {
            expect(screen.queryByText(/My Bookings/i)).not.toBeInTheDocument();
        });
    });
}); 