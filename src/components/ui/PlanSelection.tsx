"use client";

import React from "react";
import { CheckCircle, Image, MessageCircle } from "lucide-react";

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
      icon: "🆓",
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
      <h3 className="text-lg font-medium">Select Your Plan</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => onPlanChange(plan.id as PlanType)}
            className={`
              relative cursor-pointer rounded-lg border-2 p-4 transition-all
              ${
                selectedPlan === plan.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }
            `}
          >
            {selectedPlan === plan.id && (
              <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-blue-500" />
            )}
            <div className="text-3xl mb-2">{plan.icon}</div>
            <h4 className="font-bold">{plan.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{plan.description}</p>
            <p className="text-lg font-bold mt-2">{plan.price}</p>
            <div className="mt-3 space-y-2">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center text-sm">
                  {feature.includes("Unlimited") && (
                    <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
                  )}
                  {feature.includes("Image") && (
                    <Image className="h-4 w-4 mr-2 text-purple-500" />
                  )}
                  {!feature.includes("Unlimited") && !feature.includes("Image") && (
                    <div className="h-4 w-4 mr-2 flex items-center justify-center">•</div>
                  )}
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="radio"
                id={`plan-${plan.id}`}
                name="plan"
                className="sr-only"
                checked={selectedPlan === plan.id}
                onChange={() => onPlanChange(plan.id as PlanType)}
              />
              <label
                htmlFor={`plan-${plan.id}`}
                className={`
                  block w-full rounded-md py-2 text-center text-sm font-medium
                  ${
                    selectedPlan === plan.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }
                `}
              >
                {selectedPlan === plan.id ? "Selected" : "Select Plan"}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}