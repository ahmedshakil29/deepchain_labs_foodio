"use client";

type OrderItem = {
  quantity: number;
  name: string;
  price: number;
};

type OrderStatus = "PENDING" | "PREPARING" | "READY" | "COMPLETED";

type OrderPlaceCartProps = {
  orderId: string;
  placedDate: string;
  placedTime: string;
  items: OrderItem[];
  deliveryAddress: string;
  totalAmount: number;
  status: OrderStatus;
};

export default function OrderPlaceCart({
  orderId,
  placedDate,
  placedTime,
  items,
  deliveryAddress,
  totalAmount,
  status,
}: OrderPlaceCartProps) {
  const statusSteps: OrderStatus[] = [
    "PENDING",
    "PREPARING",
    "READY",
    "COMPLETED",
  ];
  const currentStepIndex = statusSteps.indexOf(status);

  const getStatusColor = (stepStatus: OrderStatus) => {
    if (stepStatus === "PENDING" && status === "PENDING") {
      return "#D4A574"; // Gold/Orange for pending
    }
    return "#1A3C34"; // Dark green for other statuses
  };

  return (
    <div className="w-full max-w-[1140px] bg-[#F8F8F8] rounded-lg p-8 shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-[24px] font-semibold text-[#1A1A1A] mb-1">
            Order #{orderId}
          </h2>
          <p className="text-[14px] text-[#666666]">
            Placed on {placedDate} at {placedTime}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[24px] font-bold text-[#1A1A1A]">
            ${totalAmount.toFixed(2)}
          </span>
          <span
            className="px-4 py-1 rounded-full text-[14px] font-medium"
            style={{
              backgroundColor: status === "PENDING" ? "#FEF7EA" : "#E8F5E9",
              color: getStatusColor(status),
            }}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      {/* Items Section */}
      <div className="mb-6">
        <h3 className="text-[14px] font-semibold text-[#666666] mb-3 uppercase tracking-wide">
          ITEMS
        </h3>
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-[#1A1A1A]">
              {item.quantity}× {item.name}
            </span>
            <span className="text-[16px] text-[#666666]">
              ${item.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Delivery Address */}
      <div className="mb-8">
        <span className="text-[14px] text-[#1A1A1A]">
          <span className="font-semibold">Delivering to:</span>{" "}
          <span className="text-[#666666]">{deliveryAddress}</span>
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative pt-4">
        {/* Progress Line */}
        <div className="absolute top-[18px] left-0 right-0 h-[2px] bg-[#E0E0E0]" />
        <div
          className="absolute top-[18px] left-0 h-[2px] bg-[#1A3C34] transition-all duration-500"
          style={{
            width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
          }}
        />

        {/* Status Steps */}
        <div className="relative flex justify-between">
          {statusSteps.map((step, index) => {
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step} className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`w-[14px] h-[14px] rounded-full transition-all duration-300 ${
                    isActive ? "bg-[#1A3C34]" : "bg-[#E0E0E0]"
                  } ${isCurrent ? "ring-4 ring-[#1A3C34] ring-opacity-20" : ""}`}
                />
                {/* Label */}
                <span
                  className={`mt-3 text-[12px] uppercase tracking-wide ${
                    isActive ? "text-[#1A1A1A] font-medium" : "text-[#999999]"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
