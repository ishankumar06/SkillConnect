import { useState, useRef, useEffect } from "react";
import { useJob } from "../context/JobContext";

// Utility: convert image file to base64 string for safe localStorage storage
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PostSection() {
  const { addJob } = useJob();

  const [form, setForm] = useState({
    author: "",
    time: "",
    title: "",
    content: "",
    address: "",
    workType: "",
    salary: "",
    workingHour: "",
    holiday: "",
    image: "", // base64 string
  });

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  // Update image preview when image base64 string changes
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

  // When user selects image file, convert to base64 and store in form.image
  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setForm((prev) => ({ ...prev, image: base64 }));
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current.click();
  };

  // Check if all required fields are filled correctly
  const isFormValid = () => {
    const {
      author,
      title,
      content,
      address,
      workType,
      salary,
      workingHour,
      holiday,
    } = form;
    return (
      author.trim() !== "" &&
      title.trim() !== "" &&
      content.trim() !== "" &&
      address.trim() !== "" &&
      workType.trim() !== "" &&
      salary.trim() !== "" &&
      workingHour.trim() !== "" &&
      holiday.trim() !== ""
    );
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    // Generate unique ID for new job post (timestamp string)
    const uniqueId = Date.now().toString();

    const newPost = {
      id: uniqueId,
      ...form,
      time: new Date().toLocaleString(),
      likes: 0,
      interested: 0,
      shares: 0,
      image: form.image,
    };
    console.log(newPost);

    addJob(newPost);

    // Reset form fields after post
    setForm({
      author: "",
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

  return (
    <form
      onSubmit={handlePost}
      className="bg-white shadow-lg p-6 mb-8 max-w-4xl mx-auto rounded-lg"
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
        className="mb-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Upload Image
      </button>

      {imagePreview && (
        <div className="mb-4 w-48 h-48 border rounded-lg overflow-hidden mx-auto">
          <img
            src={imagePreview}
            alt="Selected"
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <input
        name="author"
        value={form.author}
        onChange={handleChange}
        placeholder="Author"
        className="mb-3 w-full border border-gray-300 rounded-md p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        required
      />
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Job Title"
        className="mb-3 w-full border border-gray-300 rounded-md p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        required
      />
      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Job Description"
        rows={4}
        className="mb-3 w-full border border-gray-300 rounded-md p-3 text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        required
      />
      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        className="mb-3 w-full border border-gray-300 rounded-md p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        required
      />
      <input
        name="workType"
        value={form.workType}
        onChange={handleChange}
        placeholder="Work Type"
        className="mb-3 w-full border border-gray-300 rounded-md p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        required
      />
      <input
        name="salary"
        value={form.salary}
        onChange={handleChange}
        placeholder="Salary"
        className="mb-3 w-full border border-gray-300 rounded-md p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        required
      />
      <input
        name="workingHour"
        value={form.workingHour}
        onChange={handleChange}
        placeholder="Working Hours"
        className="mb-3 w-full border border-gray-300 rounded-md p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        required
      />
      <input
        name="holiday"
        value={form.holiday}
        onChange={handleChange}
        placeholder="Holiday Info"
        className="mb-6 w-full border border-gray-300 rounded-md p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        required
      />

      <button
        type="submit"
        disabled={!isFormValid()}
        className={`w-full py-3 rounded-lg text-white font-semibold transition ${
          isFormValid()
            ? "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Post Job
      </button>
    </form>
  );
}
