import { useState } from "react";
import axios from "axios";
import countries from "../pages/Countries"

const CreateInvestorForm = () => {
  const initialFormState = {
    name: "",
    website: "",
    image: "",
    imageSource: "upload", // "upload" or "url"
    portfolioCompanies: [{ name: "", logo: "", logoSource: "upload", link: "" }], // Added logoSource
    description: "",
    geography: "",
    investmentStages: [],
    businessModel: [],
    investorType: "",
    sectorInterested: [],
    checkSize: "",
    headquarter: "",
    contactLink: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const investmentStagesOptions = [
    "Idea Stage", "Pre-Seed", "Seed", "Series A", 
    "Series B", "Series C", "Series D", "IPO", 
    "Growth Stage"
  ];

  const sectorInterestedOptions = [
    "Technology", "Healthcare", "Finance", 
    "Education", "Retail", "Energy", 
    "Agriculture", "Transportation", "Entertainment"
  ];

  const checkSizes = [
    "$10,000 - $100,000", "$100,000 - $500,000",
    "$500,000 - $2 million", "$2 million - $10 million",
    "$10 million - $25 million", "$25 million - $100 million+"
  ];

  const businessModelOptions = [
    "C2B (Consumer to Business)",
    "D2C (Direct to Consumer)",
    "B2G (Business to Government)",
    "G2B (Government to Business)",
    "G2C (Government to Consumer)",
    "P2P (Peer to Peer)",
    "B2B SaaS (Software as a Service for Businesses)",
    "C2C SaaS (Consumer to Consumer Software)",
    "B2E (Business to Employee)",
    "B2B Marketplace",
    "B2C Marketplace",
    "B2B2G (Business to Business to Government)",
    "Franchise Model",
    "Subscription Model",
    "Freemium Model",
    "On-Demand Model",
    "Aggregator Model",
    "White Labeling",
    "Licensing Model",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageSourceChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      imageSource: value,
      image: "", // Reset the image field when switching sources
    }));
  };

  const handlePortfolioLogoSourceChange = (index, e) => {
    const { value } = e.target;
    const updatedPortfolio = [...formData.portfolioCompanies];
    updatedPortfolio[index].logoSource = value;
    updatedPortfolio[index].logo = ""; // Reset the logo field when switching sources
    setFormData({ ...formData, portfolioCompanies: updatedPortfolio });
  };

  const handleImageUpload = async (e, field, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageFormData = new FormData();
    imageFormData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://backendv3-wmen.onrender.com/api/fileUpload",
        imageFormData
      );

      if (response.data.status && response.data.data) {
        const url = response.data.data[0].url;
        if (field === "image") {
          setFormData((prev) => ({ ...prev, image: url }));
        } else if (field === "portfolioLogo" && index !== null) {
          const updatedPortfolio = [...formData.portfolioCompanies];
          updatedPortfolio[index].logo = url;
          setFormData((prev) => ({
            ...prev,
            portfolioCompanies: updatedPortfolio,
          }));
        }
        setSuccess("Image uploaded successfully!");
        setError("");
      } else {
        setError("Image upload failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while uploading the image.");
    } finally {
      setLoading(false);
    }
  };

  const handlePortfolioChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPortfolio = [...formData.portfolioCompanies];
    updatedPortfolio[index][name] = value;
    setFormData({ ...formData, portfolioCompanies: updatedPortfolio });
  };

  const addPortfolioCompany = () => {
    setFormData((prev) => ({
      ...prev,
      portfolioCompanies: [
        ...prev.portfolioCompanies,
        { name: "", logo: "", logoSource: "upload", link: "" },
      ],
    }));
  };

  const handleAddItem = (field, value) => {
    if (!formData[field].includes(value)) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
    }
  };

  const handleRemoveItem = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== value),
    }));
  };

  const removePortfolioCompany = (index) => {
    setFormData((prev) => ({
      ...prev,
      portfolioCompanies: prev.portfolioCompanies.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare data to send
    const payload = {
      ...formData,
      investmentStages: formData.investmentStages.join(", "), // Convert array to comma-separated string
      portfolioCompanies: formData.portfolioCompanies.map((company) => ({
        name: company.name,
        logo: company.logo,
        link: company.link,
      })),
    };
  
    // Remove unnecessary fields
    delete payload.imageSource;
    delete payload.portfolioCompanies.logoSource;
  
    console.log("Payload being sent:", payload); // Log the payload to verify data
  
    try {
      // Send data to server
      const response = await fetch(
        "https://venturloop-backend-v-20.onrender.com/api/create-investor",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
  
      // Check if response is OK
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error Response:", errorResponse); // Log response to debug
        throw new Error(errorResponse.message || "Failed to create investor.");
      }
  
      await response.json(); // If success, proceed with the response
      setSuccess("Investor created successfully!");
      // Reset form
      setFormData(initialFormState);
    } catch (err) {
      console.error("Error during form submission:", err.message); // Log full error message
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="max-w-6xl mx-auto bg-gray-300 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Create Investor</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        {/* Investor Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Investor Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Website */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Image Source Toggle */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Image Source</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="imageSource"
                value="upload"
                checked={formData.imageSource === "upload"}
                onChange={handleImageSourceChange}
                className="mr-2"
              />
              Upload Image
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="imageSource"
                value="url"
                checked={formData.imageSource === "url"}
                onChange={handleImageSourceChange}
                className="mr-2"
              />
              Provide Image URL
            </label>
          </div>
        </div>

        {/* Image Upload or URL Input */}
        {formData.imageSource === "upload" ? (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "image")}
              className="w-full p-2 border rounded"
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter image URL"
            />
          </div>
        )}

        {/* Display Image Preview */}
        {formData.image && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Image Preview</label>
            <img
              src={formData.image}
              alt="Uploaded"
              className="mt-2 w-32 h-32 object-cover"
            />
          </div>
        )}

        {/* Portfolio Companies */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Portfolio Companies</label>
          {formData.portfolioCompanies.map((company, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <input
                type="text"
                name="name"
                placeholder="Company Name"
                value={company.name}
                onChange={(e) => handlePortfolioChange(index, e)}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                type="url"
                name="link"
                placeholder="Website Link"
                value={company.link}
                onChange={(e) => handlePortfolioChange(index, e)}
                className="w-full p-2 border rounded mb-2"
              />

              {/* Portfolio Logo Source Toggle */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Logo Source</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`portfolioLogoSource-${index}`}
                      value="upload"
                      checked={company.logoSource === "upload"}
                      onChange={(e) => handlePortfolioLogoSourceChange(index, e)}
                      className="mr-2"
                    />
                    Upload Logo
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`portfolioLogoSource-${index}`}
                      value="url"
                      checked={company.logoSource === "url"}
                      onChange={(e) => handlePortfolioLogoSourceChange(index, e)}
                      className="mr-2"
                    />
                    Provide Logo URL
                  </label>
                </div>
              </div>

              {/* Portfolio Logo Upload or URL Input */}
              {company.logoSource === "upload" ? (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Upload Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "portfolioLogo", index)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Logo URL</label>
                  <input
                    type="url"
                    name="logo"
                    value={company.logo}
                    onChange={(e) => handlePortfolioChange(index, e)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter logo URL"
                  />
                </div>
              )}

              {/* Display Portfolio Logo Preview */}
              {company.logo && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Logo Preview</label>
                  <img
                    src={company.logo}
                    alt="Portfolio Logo"
                    className="mt-2 w-32 h-32 object-cover"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => removePortfolioCompany(index)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPortfolioCompany}
            className="bg-blue-500 text-white p-2 rounded"
          >
            + Add Portfolio Company
          </button>
        </div>

  {/* Investor Type */}
  <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Investor Type
          </label>
          <select
            name="investorType"
            value={formData.investorType}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2"
          >
            <option value="">Select Investor Type</option>
            {[
              "Angel Investors",
              "Venture Capitalists (VCs)",
              "Micro VCs",
              "Corporate Venture Capital (CVC)",
              "Accelerators and Incubators",
              "Private Equity (PE) Investors",
              "Family Offices",
              "Crowdfunding Investors",
              "Syndicates (Angel Syndicates/VC Syndicates)",
              "Hedge Funds",
              "Sovereign Wealth Funds",
              "Government Grants and Funds",
              "Strategic Investors",
              "Banks (Debt Financing)",
              "Friends and Family",
              "Bootstrap (Self-Funding)",
              "Fund of Funds (FoF)",
              "Social Impact Investors",
              "Pension Funds",
            ].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Investment Stages */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Investment Stages
          </label>
          <div className="flex flex-wrap border border-gray-300 rounded-lg p-2">
            {investmentStagesOptions.map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => handleAddItem("investmentStages", stage)}
                className={`px-3 py-1 m-1 rounded-full ${
                  formData.investmentStages.includes(stage)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap">
            {formData.investmentStages.map((stage) => (
              <span
                key={stage}
                className="bg-blue-500 text-white px-3 py-1 rounded-full m-1 flex items-center"
              >
                {stage}
                <button
                  type="button"
                  onClick={() => handleRemoveItem("investmentStages", stage)}
                  className="ml-2 text-white hover:text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Sector Interested */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Sector Interested
          </label>
          <div className="flex flex-wrap border border-gray-300 rounded-lg p-2">
            {sectorInterestedOptions.map((sector) => (
              <button
                key={sector}
                type="button"
                onClick={() => handleAddItem("sectorInterested", sector)}
                className={`px-3 py-1 m-1 rounded-full ${
                  formData.sectorInterested.includes(sector)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap">
            {formData.sectorInterested.map((sector) => (
              <span
                key={sector}
                className="bg-blue-500 text-white px-3 py-1 rounded-full m-1 flex items-center"
              >
                {sector}
                <button
                  type="button"
                  onClick={() => handleRemoveItem("sectorInterested", sector)}
                  className="ml-2 text-white hover:text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Business Model
          </label>
          <div className="flex flex-wrap border border-gray-300 rounded-lg p-2">
            {businessModelOptions.map((model) => (
              <button
                key={model}
                type="button"
                onClick={() => handleAddItem("businessModel", model)}
                className={`px-3 py-1 m-1 rounded-full ${
                  formData.businessModel.includes(model)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {model}
              </button>
            ))}
          </div>
          <div className="mt-2">
            <strong>Selected Business Models:</strong>
            <div className="flex flex-wrap mt-2">
              {formData.businessModel.map((model) => (
                <span
                  key={model}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full m-1 flex items-center"
                >
                  {model}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("businessModel", model)}
                    className="ml-2 text-white hover:text-red-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Check Size */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Check Size
          </label>
          <select
            name="checkSize"
            value={formData.checkSize}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2"
          >
            <option value="">Select Check Size</option>
            {checkSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Geography */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Geography
          </label>
          <select
            name="geography"
            value={formData.geography}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2"
          >
            <option value="">Select Geography</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Fields */}
        {[
          { name: "description", label: "Description", type: "text" },
          { name: "headquarter", label: "Headquarter", type: "text" },
          { name: "contactLink", label: "Contact Link", type: "url" },
        ].map(({ name, label, type }) => (
          <div className="mb-4" key={name}>
            <label className="block text-gray-700 font-medium mb-2">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg p-2"
            />
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Create Investor"}
        </button>
      </form>
    </div>
  );
};

export default CreateInvestorForm;


// import { useState } from "react";
// import axios from "axios";
// import countries from "./Countries";

// const CreateInvestorForm = () => {
//   const initialFormState = {
//     name: "",
//     website: "",
//     image: "",
//     portfolioCompanies: [{ name: "", logo: "", link: "" }],
//     description: "",
//     geography: "",
//     investmentStages: [],
//     businessModel: [],
//     investorType: "",
//     sectorInterested: [],
//     checkSize: "",
//     headquarter: "",
//     contactLink: "",
//   };

//   const [formData, setFormData] = useState(initialFormState);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const investmentStagesOptions = [
//     "Idea Stage",
//     "Pre-Seed",
//     "Seed",
//     "Series A",
//     "Series B",
//     "Series C",
//     "Series D (and beyond)",
//     "IPO (Initial Public Offering)",
//     "Growth Stage",
//   ];

//   const sectorInterestedOptions = [
//     "Technology",
//     "Healthcare",
//     "Finance",
//     "Education",
//     "Retail",
//     "Energy",
//     "Agriculture",
//     "Transportation",
//     "Entertainment",
//   ];

//   const checkSizes = [
//     "$10,000 - $100,000",
//     "$100,000 - $500,000",
//     "$500,000 - $2 million",
//     "$2 million - $10 million",
//     "$10 million - $25 million",
//     "$25 million - $100 million+",
//     "$500,000 - $50 million+",
//     "$10 million - $100 million+",
//   ];

//   const businessModelOptions = [
//     "C2B (Consumer to Business)",
//     "D2C (Direct to Consumer)",
//     "B2G (Business to Government)",
//     "G2B (Government to Business)",
//     "G2C (Government to Consumer)",
//     "P2P (Peer to Peer)",
//     "B2B SaaS (Software as a Service for Businesses)",
//     "C2C SaaS (Consumer to Consumer Software)",
//     "B2E (Business to Employee)",
//     "B2B Marketplace",
//     "B2C Marketplace",
//     "B2B2G (Business to Business to Government)",
//     "Franchise Model",
//     "Subscription Model",
//     "Freemium Model",
//     "On-Demand Model",
//     "Aggregator Model",
//     "White Labeling",
//     "Licensing Model",
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleAddItem = (field, value) => {
//     if (!formData[field].includes(value)) {
//       setFormData((prev) => ({
//         ...prev,
//         [field]: [...prev[field], value],
//       }));
//     }
//   };

//   const handleRemoveItem = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: prev[field].filter((item) => item !== value),
//     }));
//   };

//   const handlePortfolioChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedPortfolio = [...formData.portfolioCompanies];
//     updatedPortfolio[index][name] = value;
//     setFormData({ ...formData, portfolioCompanies: updatedPortfolio });
//   };

//   const addPortfolioCompany = () => {
//     setFormData((prev) => ({
//       ...prev,
//       portfolioCompanies: [
//         ...prev.portfolioCompanies,
//         { name: "", logo: "", link: "" },
//       ],
//     }));
//   };

//   const removePortfolioCompany = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       portfolioCompanies: prev.portfolioCompanies.filter((_, i) => i !== index),
//     }));
//   };

//   const handleImageUpload = async (e, field, index = null) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const imageFormData = new FormData();
//     imageFormData.append("file", file);

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         "https://backendv3-wmen.onrender.com/api/fileUpload",
//         imageFormData
//       );

//       if (response.data.status && response.data.data) {
//         const url = response.data.data[0].url;
//         if (field === "image") {
//           setFormData((prev) => ({ ...prev, image: url }));
//         } else if (field === "portfolioLogo" && index !== null) {
//           const updatedPortfolio = [...formData.portfolioCompanies];
//           updatedPortfolio[index].logo = url;
//           setFormData((prev) => ({
//             ...prev,
//             portfolioCompanies: updatedPortfolio,
//           }));
//         }
//         setSuccess("Image uploaded successfully!");
//         setError("");
//       } else {
//         setError("Image upload failed. Please try again.");
//       }
//     } catch (err) {
//       setError("An error occurred while uploading the image.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     const payload = {
//       name: formData.name,
//       website: formData.website,
//       image: formData.image, // URL or base64 string
//       portfolioCompanies: formData.portfolioCompanies.map((company) => ({
//         name: company.name,
//         logo: company.logo, // URL or base64 string
//         link: company.link,
//       })),
//       description: formData.description,
//       geography: formData.geography,
//       investmentStages: formData.investmentStages.join(", "),
//       businessModel: formData.businessModel, // Array of strings
//       investorType: formData.investorType,
//       sectorInterested: formData.sectorInterested, // Array of strings
//       checkSize: formData.checkSize,
//       headquarter: formData.headquarter,
//       contactLink: formData.contactLink,
//     };

//     try {
//       const response = await fetch(
//         "https://venturloop-backend-v-20.onrender.com/api/create-investor",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to create investor.");
//       }

//       const data = await response.json();
//       setSuccess("Investor created successfully!");
//       console.log("Response Data:", data);
//       // Optionally reset form after success
//       setFormData(initialFormState);
//     } catch (err) {
//       console.error("Error:", err);
//       setError(err.message || "An error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto bg-gray-300 shadow-md rounded-lg p-6">
//       <h2 className="text-2xl font-semibold mb-4">Create Investor</h2>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       {success && <p className="text-green-500 mb-4">{success}</p>}
//       <form onSubmit={handleSubmit}>
//         {/* Investor Name */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Investor Name
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//             required
//           />
//         </div>

//         {/* Website */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Website
//           </label>
//           <input
//             type="url"
//             name="website"
//             value={formData.website}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//             required
//           />
//         </div>

//         {/* Profile Image */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Upload Image
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => handleImageUpload(e, "image")}
//             className="w-full border-gray-300 rounded-lg p-2"
//           />
//           {formData.image && (
//             <div className="mt-2">
//               <img
//                 src={formData.image}
//                 alt="Uploaded"
//                 className="h-24 rounded-lg"
//               />
//             </div>
//           )}
//         </div>

//         {/* Portfolio Companies */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Portfolio Companies
//           </label>
//           {formData.portfolioCompanies.map((company, index) => (
//             <div key={index} className="mb-2 flex items-center space-x-2">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Company Name"
//                 value={company.name}
//                 onChange={(e) => handlePortfolioChange(index, e)}
//                 className="flex-1 border-gray-300 rounded-lg p-2"
//                 required
//               />
//               <input
//                 type="url"
//                 name="link"
//                 placeholder="Website Link"
//                 value={company.link}
//                 onChange={(e) => handlePortfolioChange(index, e)}
//                 className="flex-1 border-gray-300 rounded-lg p-2"
//               />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleImageUpload(e, "portfolioLogo", index)}
//                 className="flex-1 border-gray-300 rounded-lg p-2"
//               />
//               {company.logo && (
//                 <div className="mt-2">
//                   <img
//                     src={company.logo}
//                     alt="Portfolio Logo"
//                     className="h-24 rounded-lg"
//                   />
//                 </div>
//               )}
//               <button
//                 type="button"
//                 onClick={() => removePortfolioCompany(index)}
//                 className="text-red-500 font-semibold mt-2"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={addPortfolioCompany}
//             className="text-blue-500 font-semibold mt-2"
//           >
//             + Add Portfolio Company
//           </button>
//         </div>

//         {/* Investor Type */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Investor Type
//           </label>
//           <select
//             name="investorType"
//             value={formData.investorType}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           >
//             <option value="">Select Investor Type</option>
//             {[
//               "Angel Investors",
//               "Venture Capitalists (VCs)",
//               "Micro VCs",
//               "Corporate Venture Capital (CVC)",
//               "Accelerators and Incubators",
//               "Private Equity (PE) Investors",
//               "Family Offices",
//               "Crowdfunding Investors",
//               "Syndicates (Angel Syndicates/VC Syndicates)",
//               "Hedge Funds",
//               "Sovereign Wealth Funds",
//               "Government Grants and Funds",
//               "Strategic Investors",
//               "Banks (Debt Financing)",
//               "Friends and Family",
//               "Bootstrap (Self-Funding)",
//               "Fund of Funds (FoF)",
//               "Social Impact Investors",
//               "Pension Funds",
//             ].map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Investment Stages */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Investment Stages
//           </label>
//           <div className="flex flex-wrap border border-gray-300 rounded-lg p-2">
//             {investmentStagesOptions.map((stage) => (
//               <button
//                 key={stage}
//                 type="button"
//                 onClick={() => handleAddItem("investmentStages", stage)}
//                 className={`px-3 py-1 m-1 rounded-full ${
//                   formData.investmentStages.includes(stage)
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-gray-700"
//                 }`}
//               >
//                 {stage}
//               </button>
//             ))}
//           </div>
//           <div className="mt-2 flex flex-wrap">
//             {formData.investmentStages.map((stage) => (
//               <span
//                 key={stage}
//                 className="bg-blue-500 text-white px-3 py-1 rounded-full m-1 flex items-center"
//               >
//                 {stage}
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveItem("investmentStages", stage)}
//                   className="ml-2 text-white hover:text-red-500"
//                 >
//                   &times;
//                 </button>
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Sector Interested */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Sector Interested
//           </label>
//           <div className="flex flex-wrap border border-gray-300 rounded-lg p-2">
//             {sectorInterestedOptions.map((sector) => (
//               <button
//                 key={sector}
//                 type="button"
//                 onClick={() => handleAddItem("sectorInterested", sector)}
//                 className={`px-3 py-1 m-1 rounded-full ${
//                   formData.sectorInterested.includes(sector)
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-gray-700"
//                 }`}
//               >
//                 {sector}
//               </button>
//             ))}
//           </div>
//           <div className="mt-2 flex flex-wrap">
//             {formData.sectorInterested.map((sector) => (
//               <span
//                 key={sector}
//                 className="bg-blue-500 text-white px-3 py-1 rounded-full m-1 flex items-center"
//               >
//                 {sector}
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveItem("sectorInterested", sector)}
//                   className="ml-2 text-white hover:text-red-500"
//                 >
//                   &times;
//                 </button>
//               </span>
//             ))}
//           </div>
//         </div>

//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Business Model
//           </label>
//           <div className="flex flex-wrap border border-gray-300 rounded-lg p-2">
//             {businessModelOptions.map((model) => (
//               <button
//                 key={model}
//                 type="button"
//                 onClick={() => handleAddItem("businessModel", model)}
//                 className={`px-3 py-1 m-1 rounded-full ${
//                   formData.businessModel.includes(model)
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-200 text-gray-700"
//                 }`}
//               >
//                 {model}
//               </button>
//             ))}
//           </div>
//           <div className="mt-2">
//             <strong>Selected Business Models:</strong>
//             <div className="flex flex-wrap mt-2">
//               {formData.businessModel.map((model) => (
//                 <span
//                   key={model}
//                   className="bg-blue-500 text-white px-3 py-1 rounded-full m-1 flex items-center"
//                 >
//                   {model}
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveItem("businessModel", model)}
//                     className="ml-2 text-white hover:text-red-500"
//                   >
//                     &times;
//                   </button>
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Check Size */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Check Size
//           </label>
//           <select
//             name="checkSize"
//             value={formData.checkSize}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           >
//             <option value="">Select Check Size</option>
//             {checkSizes.map((size) => (
//               <option key={size} value={size}>
//                 {size}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Geography */}
//         <div className="mb-4">
//           <label className="block text-gray-700 font-medium mb-2">
//             Geography
//           </label>
//           <select
//             name="geography"
//             value={formData.geography}
//             onChange={handleChange}
//             className="w-full border-gray-300 rounded-lg p-2"
//           >
//             <option value="">Select Geography</option>
//             {countries.map((country) => (
//               <option key={country} value={country}>
//                 {country}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Additional Fields */}
//         {[
//           { name: "description", label: "Description", type: "text" },
//           { name: "headquarter", label: "Headquarter", type: "text" },
//           { name: "contactLink", label: "Contact Link", type: "url" },
//         ].map(({ name, label, type }) => (
//           <div className="mb-4" key={name}>
//             <label className="block text-gray-700 font-medium mb-2">
//               {label}
//             </label>
//             <input
//               type={type}
//               name={name}
//               value={formData[name]}
//               onChange={handleChange}
//               className="w-full border-gray-300 rounded-lg p-2"
//             />
//           </div>
//         ))}

//         {/* Submit Button */}
//         <div>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//             disabled={loading}
//           >
//             {loading ? "Creating Investor..." : "Create Investor"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateInvestorForm;
