"use client";

import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { submitClaimRequest } from "../../lib/api"; // Import the specific function

export default function ClaimFormPage() {
  const { itemId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      proofOfOwnership: "",
    },
    mode: "onSubmit", // Validate on submit
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage(null);

    // Log the data being sent for debugging
    console.log("Submitting data:", { itemId, ...data });

    // Ensure itemId is included in the request body
    const requestData = { itemId, ...data };

    try {
      const res = await submitClaimRequest(itemId, requestData);

      setMessage({ type: "success", text: res.data.message });
      reset(); // Reset form after success
      setTimeout(() => router.push("/dashboard"), 2000); // Redirect after 2 seconds
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to submit claim",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Claim This Item</h1>

      {message && (
        <div
          className={`p-3 mb-4 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Student ID</label>
          <input
            {...register("studentId", {
              required: "Student ID is required",
              validate: (value) => value.trim() !== "" || "Cannot be empty",
            })}
            className="w-full p-2 border rounded-lg"
            disabled={loading}
          />
          {errors.studentId && (
            <p className="text-red-500 text-sm">{errors.studentId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Admission Number</label>
          <input
            {...register("admissionNumber", {
              required: "Admission number is required",
              validate: (value) => value.trim() !== "" || "Cannot be empty",
            })}
            className="w-full p-2 border rounded-lg"
            disabled={loading}
          />
          {errors.admissionNumber && (
            <p className="text-red-500 text-sm">{errors.admissionNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">National ID</label>
          <input
            {...register("nationalId", {
              required: "National ID is required",
              validate: (value) => value.trim() !== "" || "Cannot be empty",
            })}
            className="w-full p-2 border rounded-lg"
            disabled={loading}
          />
          {errors.nationalId && (
            <p className="text-red-500 text-sm">{errors.nationalId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Active Contact Number</label>
          <input
            {...register("contactNumber", {
              required: "Contact number is required",
              validate: (value) => value.trim() !== "" || "Cannot be empty",
            })}
            className="w-full p-2 border rounded-lg"
            disabled={loading}
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Why is this your item?</label>
          <textarea
            {...register("howIsThisYourItem", {
              required: "Explanation is required",
              validate: (value) => value.trim() !== "" || "Cannot be empty",
            })}
            className="w-full p-2 border rounded-lg"
            rows={3}
            disabled={loading}
          />
          {errors.howIsThisYourItem && (
            <p className="text-red-500 text-sm">{errors.howIsThisYourItem.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Proof of Ownership (optional)</label>
          <textarea
            {...register("proofOfOwnership")}
            className="w-full p-2 border rounded-lg"
            rows={2}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Submitting..." : "Submit Claim"}
        </button>
      </form>
    </div>
  );
}