"use client";
import React from "react";
import { CheckCircle, Image, MessageCircle, Shield } from "lucide-react";

export type PlanType = "free" | "standard" | "premium";

interface PlanSelectionProps {
  selectedPlan: PlanType;
  onPlanChange: (plan: PlanType) => void;
}

export function PlanSelection({ selectedPlan, onPlanChange }: PlanSelectionProps) {
  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Basic access to get started",
      price: "$0/month",
      features: ["1 response limit", "Basic features"],
      icon: "FREE",
    },
    {
      id: "standard",
      name: "Standard",
      description: "Perfect for regular users",
      price: "$9.99/month",
      features: ["Unlimited responses", "Enhanced features"],
      icon: "⭐",
    },
    {
      id: "premium",
      name: "Premium",
      description: "Full access to all features",
      price: "$19.99/month",
      features: ["Unlimited responses", "Image generation", "Priority support"],
      icon: "💎",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-[Poppins] font-medium">Select Your Plan</h3>
      <div className="flex flex-col space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => onPlanChange(plan.id as PlanType)}
            className={`
              relative cursor-pointer rounded-lg border-2 p-4 transition-all
              ${
                selectedPlan === plan.id
                  ? "border-blue-500 dark:bg-teal-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }
            `}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              {/* Plan Info Section */}
              <div className="flex items-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-800 mr-3">
                  {plan.id === "free" ? (
                    <div className="text-blue-500 text-xs font-[Poppins]  font-bold">{plan.icon}</div>
                  ) : (
                    <div className="text-xl">{plan.icon}</div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold font-[Poppins] ">{plan.name}</h4>
                  <p className="text-xs font-[Poppins]  text-gray-500 dark:text-gray-400">{plan.description}</p>
                </div>
              </div>

              {/* Price Section */}
              <div className="mt-2 sm:mt-0 sm:text-right">
                <p className="text-lg font-bold">{plan.price}</p>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center text-sm">
                  {feature.includes("Unlimited") && (
                    <MessageCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                  )}
                  {feature.includes("Image") && (
                    <Image className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
                  )}
                  {feature.includes("Priority") && (
                    <Shield className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />
                  )}
                  {!feature.includes("Unlimited") && !feature.includes("Image") && !feature.includes("Priority") && (
                    <div className="h-4 w-4 mr-2 flex items-center justify-center flex-shrink-0">•</div>
                  )}
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Selection Button */}
            <div className="mt-4">
              <button
                type="button"
                className={`
                  w-full rounded-md py-2 text-center text-sm font-medium transition-colors
                  ${
                    selectedPlan === plan.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }
                `}
              >
                {selectedPlan === plan.id ? "Selected" : "Select Plan"}
              </button>
            </div>

            {/* Selected indicator */}
            {selectedPlan === plan.id && (
              <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-blue-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}