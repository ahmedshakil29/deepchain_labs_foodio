"use client";

import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";

type MenuItem = {
  menuItemId: number;
  name: string;
  price: number;
};

type OrderItem = {
  menuItemId: number;
  quantity: number;
};

type OrderConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem;
  onConfirm: (orderData: OrderItem) => void;
};

export default function OrderConfirmModal({
  isOpen,
  onClose,
  menuItem,
  onConfirm,
}: OrderConfirmModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => quantity > 1 && setQuantity((prev) => prev - 1);

  const handleConfirm = () => {
    onConfirm({ menuItemId: menuItem.menuItemId, quantity });
    onClose();
    setQuantity(1);
  };

  const handleCancel = () => {
    onClose();
    setQuantity(1);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[20px] font-semibold text-[#1A1A1A]">
            Confirm your order
          </h2>
          <button
            onClick={handleCancel}
            className="text-[#999999] hover:text-[#1A1A1A] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Item Details */}
        <div className="mb-8">
          <h3 className="text-[14px] text-[#666666] mb-4">Item</h3>
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-[16px] text-[#1A1A1A] block">
                {menuItem.name}
              </span>
              <span className="text-[14px] text-[#666666]">
                ${menuItem.price.toFixed(2)} each
              </span>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleIncrement}
                className="w-8 h-8 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center hover:bg-[#F5F5F5] transition-colors"
              >
                <Plus size={16} />
              </button>
              <span className="text-[16px] font-medium text-center w-8">
                {quantity}
              </span>
              <button
                onClick={handleDecrement}
                className="w-8 h-8 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center hover:bg-[#F5F5F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-[#E5E5E5]">
            <span className="text-[16px] font-semibold text-[#1A1A1A]">
              Total
            </span>
            <span className="text-[20px] font-bold text-[#1A3C34]">
              ${(menuItem.price * quantity).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 h-12 rounded-full border-2 border-[#1A3C34] text-[#1A3C34] font-medium hover:bg-[#F5F5F5] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 h-12 rounded-full bg-[#1A3C34] text-white font-medium hover:brightness-110 transition-all"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </>
  );
}

// "use client";

// import { useState } from "react";
// import { X, Plus, Minus } from "lucide-react";

// type MenuItem = {
//   menuItemId: number;
//   name: string;
//   price: number;
// };

// type OrderItem = {
//   menuItemId: number;
//   quantity: number;
// };

// type OrderDetailsCartProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   menuItem: MenuItem;
//   onConfirm: (orderData: OrderItem) => void;
// };

// export default function OrderDetailsCart({
//   isOpen,
//   onClose,
//   menuItem,
//   onConfirm,
// }: OrderDetailsCartProps) {
//   const [quantity, setQuantity] = useState(1);

//   if (!isOpen) return null;

//   const handleIncrement = () => {
//     setQuantity((prev) => prev + 1);
//   };

//   const handleDecrement = () => {
//     if (quantity > 1) {
//       setQuantity((prev) => prev - 1);
//     }
//   };

//   const handleConfirm = () => {
//     const orderData: OrderItem = {
//       menuItemId: menuItem.menuItemId,
//       quantity: quantity,
//     };
//     onConfirm(orderData);
//     onClose();
//     setQuantity(1); // Reset quantity after confirm
//   };

//   const handleCancel = () => {
//     onClose();
//     setQuantity(1); // Reset quantity on cancel
//   };

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         // className="fixed inset-0 bg-black  bg-opacity-40 z-40"
//         className="fixed inset-0 bg-white/30 backdrop-blur-md z-40"
//         onClick={handleCancel}
//       />

//       {/* Modal */}
//       <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[485px] bg-white rounded-2xl shadow-2xl p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-[20px] font-semibold text-[#1A1A1A]">
//             Are you sure want to buy?
//           </h2>
//           <button
//             onClick={handleCancel}
//             className="text-[#999999] hover:text-[#1A1A1A] transition-colors"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* Items Section */}
//         <div className="mb-8">
//           <h3 className="text-[14px] text-[#666666] mb-4">Items</h3>

//           <div className="flex justify-between items-center mb-4">
//             <div>
//               <span className="text-[16px] text-[#1A1A1A] block">
//                 {menuItem.name}
//               </span>
//               <span className="text-[14px] text-[#666666]">
//                 ${menuItem.price.toFixed(2)} each
//               </span>
//             </div>

//             {/* Quantity Controls */}
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={handleIncrement}
//                 className="w-[32px] h-[32px] rounded-full border-2 border-[#1A1A1A] flex items-center justify-center hover:bg-[#F5F5F5] transition-colors"
//               >
//                 <Plus size={16} className="text-[#1A1A1A]" />
//               </button>

//               <span className="text-[16px] font-medium text-[#1A1A1A] w-8 text-center">
//                 {quantity}
//               </span>

//               <button
//                 onClick={handleDecrement}
//                 className="w-[32px] h-[32px] rounded-full border-2 border-[#1A1A1A] flex items-center justify-center hover:bg-[#F5F5F5] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
//                 disabled={quantity <= 1}
//               >
//                 <Minus size={16} className="text-[#1A1A1A]" />
//               </button>
//             </div>
//           </div>

//           {/* Total Price */}
//           <div className="flex justify-between items-center pt-4 border-t border-[#E5E5E5]">
//             <span className="text-[16px] font-semibold text-[#1A1A1A]">
//               Total
//             </span>
//             <span className="text-[20px] font-bold text-[#1A3C34]">
//               ${(menuItem.price * quantity).toFixed(2)}
//             </span>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-4">
//           <button
//             onClick={handleCancel}
//             className="flex-1 h-[48px] rounded-full border-2 border-[#1A3C34] text-[#1A3C34] font-medium text-[16px] hover:bg-[#F5F5F5] transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleConfirm}
//             className="flex-1 h-[48px] rounded-full bg-[#1A3C34] text-white font-medium text-[16px] hover:brightness-110 transition-all"
//           >
//             Confirm Order
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }
