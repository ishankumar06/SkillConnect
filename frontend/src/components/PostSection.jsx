import React, { useState, useRef, useEffect } from "react";
import { useJob } from "../context/JobContext";
import { useAuth } from "../context/AuthContext";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const icon = (
  <span className="flex items-center justify-center w-12 h-12 rounded-xl shadow-sm">
    <i className="fas fa-briefcase text-2xl text-gray-500" />
  </span>
);

export default function PostSection() {
  const { addJob } = useJob();
  const { authUser } = useAuth();

  const [form, setForm] = useState({
    time: "",
    title: "",
    content: "",
    address: "",
    workType: "",
    salary: "",
    workingHour: "",
    holiday: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    if (!form.image) {
      setImagePreview(null);
      return;
    }
    setImagePreview(form.image);
  }, [form.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setForm((prev) => ({ ...prev, image: base64 }));
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current.click();
  };

  const isFormValid = () => {
    return (
      form.title.trim() !== "" &&
      form.content.trim() !== "" &&
      form.address.trim() !== "" &&
      form.workType.trim() !== "" &&
      form.salary.trim() !== "" &&
      form.workingHour.trim() !== "" &&
      form.holiday.trim() !== ""
    );
  };

  const handlePost = (e) => {
    e.preventDefault();

    if (!authUser || !authUser._id) {
      alert("You must be logged in to post a job.");
      return;
    }

    if (!isFormValid()) {
      alert("Please fill in all required fields.");
      return;
    }

    const uniqueId = Date.now().toString();
    const newPost = {
      id: uniqueId,
      author: authUser._id, // Set author as logged in user's ID here
      ...form,
      time: new Date().toLocaleString(),
      likes: 0,
      interested: 0,
      shares: 0,
      image: form.image,
    };

    addJob(newPost);

    setForm({
      time: "",
      title: "",
      content: "",
      address: "",
      workType: "",
      salary: "",
      workingHour: "",
      holiday: "",
      image: "",
    });
    setImagePreview(null);
  };

  const fields = [
    { name: "title", placeholder: "Job Title", required: true },
    { name: "content", placeholder: "Job Description", as: "textarea", rows: 3, required: true },
    { name: "address", placeholder: "Address", required: true },
    { name: "workType", placeholder: "Work Type", required: true },
    { name: "salary", placeholder: "Salary", required: true },
    { name: "workingHour", placeholder: "Working Hours", required: true },
    { name: "holiday", placeholder: "Holiday Info", required: true },
  ];

  return (
    <form
      onSubmit={handlePost}
      className="max-w-3xl mx-auto p-6 space-y-6 rounded-2xl bg-white shadow-md"
      noValidate
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      <button
        type="button"
        onClick={triggerImageUpload}
        className="flex items-center gap-3 rounded-lg px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50 transition"
      >
        <i className="fas fa-upload text-lg" />
        Upload Image
      </button>

      {imagePreview && (
        <div className="w-48 h-48 rounded-lg overflow-hidden border border-gray-200 mx-auto">
          <img src={imagePreview} alt="Selected" className="object-cover w-full h-full" />
        </div>
      )}

      {fields.map((field) => {
        const Component = field.as === "textarea" ? "textarea" : "input";
        return (
          <div key={field.name} className="flex gap-4 items-center">
            {icon}
            <label className="flex-1 block">
              <span className="text-gray-900 font-semibold">
                {field.placeholder}
                {field.required && <span className="text-red-600 ml-1">*</span>}
              </span>
              <Component
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                rows={field.rows}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 resize-none outline-none text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition"
                required={field.required}
              />
            </label>
          </div>
        );
      })}

      <button
        type="submit"
        disabled={!isFormValid()}
        className={`w-full py-3 rounded-2xl font-bold transition ${
          isFormValid()
            ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
        }`}
      >
        Post Job
      </button>
    </form>
  );
}
