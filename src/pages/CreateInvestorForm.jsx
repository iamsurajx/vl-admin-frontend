import { useState } from "react";
import axios from "axios";
import countries from "./Countries";

const CreateInvestorForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    image: "",
    portfolioCompanies: [{ name: "", logo: "", link: "" }],
    description: "",
    geography: "",
    investmentStages: "",
    businessModel: "",
    investorType: "",
    sectorInterested: "",
    checkSize: "",
    headquarter: "",
    contactLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input change for main fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle input change for portfolio companies
  const handlePortfolioChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPortfolio = [...formData.portfolioCompanies];
    updatedPortfolio[index][name] = value;
    setFormData({ ...formData, portfolioCompanies: updatedPortfolio });
  };

  // Add a new portfolio company
  const addPortfolioCompany = () => {
    setFormData({
      ...formData,
      portfolioCompanies: [
        ...formData.portfolioCompanies,
        { name: "", logo: "", link: "" },
      ],
    });
  };

  // Remove a portfolio company
  const removePortfolioCompany = (index) => {
    const updatedPortfolio = formData.portfolioCompanies.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, portfolioCompanies: updatedPortfolio });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "https://backendv3-wmen.onrender.com/api/create-investor",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSuccess("Investor created successfully!");
      setFormData({
        name: "",
        website: "",
        image: "",
        portfolioCompanies: [{ name: "", logo: "", link: "" }],
        description: "",
        geography: "",
        investmentStages: "",
        businessModel: "",
        investorType: "",
        sectorInterested: "",
        checkSize: "",
        headquarter: "",
        contactLink: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, field, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageFormData = new FormData();
    imageFormData.append("file", file);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://backendv3-wmen.onrender.com/api/fileUpload",
      data: imageFormData,
    };

    try {
      setLoading(true);
      const response = await axios.request(config);
      if (response.data.status && response.data.data) {
        const url = response.data.data[0].url;

        if (field === "image") {
          // Update profile image
          setFormData((prevFormData) => ({
            ...prevFormData,
            image: url,
          }));
        } else if (field === "portfolioLogo" && index !== null) {
          // Update portfolio company logo
          setFormData((prevFormData) => {
            const updatedPortfolio = [...prevFormData.portfolioCompanies];
            updatedPortfolio[index].logo = url;
            return {
              ...prevFormData,
              portfolioCompanies: updatedPortfolio,
            };
          });
        }
        setError("");
        setSuccess("Image uploaded successfully!");
      } else {
        setError("Image upload failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while uploading the image.");
    } finally {
      setLoading(false);
    }
  };





  // 
  const checkSizes = [
    "$10,000 - $100,000",
    "$100,000 - $500,000",   // Remove duplicate
    "$500,000 - $2 million",
    "$2 million - $10 million",
    "$10 million - $25 million",
    "$25 million - $100 million+",
    "$500,000 - $50 million+",
    "$10 million - $100 million+"
  ];



  return (
    <div className="max-w-6xl mx-auto bg-gray-300 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Create Investor</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Investor Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2"
            required
          />
        </div>


        {/* Website */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg p-2"
            required
          />
        </div>

           {/* Profile Image Upload */}
           <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "image")}
            className="w-full border-gray-300 rounded-lg p-2"
          />
          {formData.image && (
            <div className="mt-2">
              <img
                src={formData.image}
                alt="Uploaded"
                className="h-24 rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Portfolio Companies */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Portfolio Companies
          </label>
          {formData.portfolioCompanies.map((company, index) => (
            <div key={index} className="mb-2 flex items-center space-x-2">
              {/* Company Name */}
              <input
                type="text"
                name="name"
                placeholder="Company Name"
                value={company.name}
                onChange={(e) => handlePortfolioChange(index, e)}
                className="flex-1 border-gray-300 rounded-lg p-2"
                required
              />

              {/* Company Link */}
              <input
                type="url"
                name="link"
                placeholder="Website Link"
                value={company.link}
                onChange={(e) => handlePortfolioChange(index, e)}
                className="flex-1 border-gray-300 rounded-lg p-2"
              />

              {/* Portfolio Company Logo Upload */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "portfolioLogo", index)}
                className="flex-1 border-gray-300 rounded-lg p-2"
              />

              {/* Display Portfolio Company Logo */}
              {company.logo && (
                <div className="mt-2">
                  <img
                    src={company.logo}
                    alt="Uploaded Logo"
                    className="h-24 rounded-lg"
                  />
                </div>
              )}

              {/* Remove Portfolio Company Button */}
              <button
                type="button"
                onClick={() => removePortfolioCompany(index)}
                className="text-red-500 font-semibold mt-2"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Add Portfolio Company Button */}
          <button
            type="button"
            onClick={addPortfolioCompany}
            className="text-blue-500 font-semibold mt-2"
          >
            + Add Portfolio Company
          </button>
        </div>


        {/* Investor Type Dropdown */}
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
            <option value="Angel Investors">Angel Investors</option>
            <option value="Venture Capitalists (VCs)">Venture Capitalists (VCs)</option>
            <option value="Micro VCs">Micro VCs</option>
            <option value="Corporate Venture Capital (CVC)">Corporate Venture Capital (CVC)</option>
            <option value="Accelerators and Incubators">Accelerators and Incubators</option>
            <option value="Private Equity (PE) Investors">Private Equity (PE) Investors</option>
            <option value="Family Offices">Family Offices</option>
            <option value="Crowdfunding Investors">Crowdfunding Investors</option>
            <option value="Syndicates (Angel Syndicates/VC Syndicates)">Syndicates (Angel Syndicates/VC Syndicates)</option>
            <option value="Hedge Funds">Hedge Funds</option>
            <option value="Sovereign Wealth Funds">Sovereign Wealth Funds</option>
            <option value="Government Grants and Funds">Government Grants and Funds</option>
            <option value="Strategic Investors">Strategic Investors</option>
            <option value="Banks (Debt Financing)">Banks (Debt Financing)</option>
            <option value="Friends and Family">Friends and Family</option>
            <option value="Bootstrap (Self-Funding)">Bootstrap (Self-Funding)</option>
            <option value="Fund of Funds (FoF)">Fund of Funds (FoF)</option>
            <option value="Social Impact Investors">Social Impact Investors</option>
            <option value="Pension Funds">Pension Funds</option>
          </select>
        </div>

        {/* Investment Stages */}
        <div className="grid grid-cols-2 gap-4">
          {/* Investment Stages Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Investment Stages
            </label>
            <select
              name='investmentStages'
              value={formData.investmentStages}
              onChange={handleChange}
              className='w-full border-gray-300 rounded-lg p-2'
            >
              <option value=''>Select Investment Stage</option>
              {["Idea Stage", "Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Series D (and beyond)", "IPO (Initial Public Offering)", "Growth Stage"].map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          {/* Business Model Dropdown */}
          <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-2'>
              Business Model
            </label>
            <select
              name='businessModel'
              value={formData.businessModel}
              onChange={handleChange}
              className='w-full border-gray-300 rounded-lg p-2'
            >
              <option value=''>Select Business Model</option>
              {[
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
              ].map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>


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



          {/* Geography Dropdown */}
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

          {/* Other Fields */}
          {[
            { name: 'description', label: 'Description', type: 'text' },
            { name: 'sectorInterested', label: 'Sector Interested', type: 'text' },
            { name: 'headquarter', label: 'Headquarter', type: 'text' },
            { name: 'contactLink', label: 'Contact Link', type: 'url' },
          ].map(({ name, label, type }) => (
            <div key={name} className='mb-4'>
              <label className='block text-gray-700 font-medium mb-2'>{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className='w-full border-gray-300 rounded-lg p-2'
              />
            </div>
          ))}

        </div>



        {/* Submit Button */}
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded-lg'
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Create Investor'}
        </button>

      </form>
    </div>
  );
};

export default CreateInvestorForm;
