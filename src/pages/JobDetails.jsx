import axios from "axios";
import { compareAsc, format } from "date-fns";
import { useContext, useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";

const JobDetails = () => {
  const [startDate, setStartDate] = useState(new Date());
  const { id } = useParams();
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();

  const [job, setJob] = useState({});

  const handleUpdateData = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APIURL}/job/${id}`,
      );
      setJob(data);
      setStartDate(new Date(data.deadline));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleUpdateData();
  }, [id]);

  const {
    _id,
    title,
    deadline,
    description,
    category,
    min_price,
    max_price,
    buyer,
  } = job || {};

  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const price = parseFloat(form.price.value);
    const email = user?.email;
    const comment = form.comment.value;
    const jobDeadline = new Date(job.deadline);
    const today = new Date();
    const userSelectedDate = startDate;
    const jobId = _id;

    if (job.status === 'Closed') {
        return toast.error('This job is already closed!');
    }
    // validation email 
    if (user?.email === buyer?.email) {
    return toast.error('Action Not Permitted: You cannot bid on your own job!');
  }

    // deadline Validation chek
    if(compareAsc(today, jobDeadline) === 1) return toast.error('Deadline Crossed, Bidding Forbidden');

    if (userSelectedDate < today.setHours(0,0,0,0)) {
    return toast.error('It is not possible to bid on a past date!');
  }

    if (compareAsc(userSelectedDate, jobDeadline) === 1) {
    return toast.error('You cannot select a date after the deadline for Job!');
  }

    // max Price Validation
    if(price > max_price) return toast.error('please the price have equal or less then')

      // min price validation
      if(price <= 0) {
        return toast.error('Not Valid')
      }

    const newData = {price, email, comment, jobId, deadline:startDate, title, category, status: 'pending', buyer:buyer?.email};
    
     try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APIURL}/addBid`,
        newData,
      );

      if (data.insertedId) {
        toast.success("Bid Added Successfully");
        form.reset();
        navigate("/my-bids");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error?.response?.data);
    }

  }

  return (

  <div className="flex flex-col md:flex-row justify-around gap-5 items-center min-h-[calc(100vh-306px)] md:max-w-screen-xl mx-auto ">
    
    {/* ১. Job Details section */}
    <div className="flex-1 px-4 py-7 bg-white rounded-md shadow-md md:min-h-[350px]">
      <div className="flex items-center justify-between">
        {deadline && (
          <span className="text-sm font-light text-gray-800 ">
            Deadline: {format(new Date(deadline), "P")}
          </span>
        )}
        <span className="px-4 py-1 text-xs text-blue-800 uppercase bg-blue-200 rounded-full ">
          {category}
        </span>
      </div>

      <div>
        <h1 className="mt-2 text-3xl font-semibold text-gray-800 ">{title}</h1>
        <p className="mt-2 text-lg text-gray-600 ">{description}</p>
        <p className="mt-6 text-sm font-bold text-gray-600 ">Buyer Details:</p>
        <div className="flex items-center gap-5">
          <div>
            <p className="mt-2 text-sm text-gray-600 ">{buyer?.name}</p>
            <p className="mt-2 text-sm text-gray-600 ">{buyer?.email}</p>
          </div>
          <div className="rounded-full object-cover overflow-hidden w-14 h-14">
            <img src={buyer?.photo} alt="" />
          </div>
        </div>
        <p className="mt-6 text-lg font-bold text-gray-600 ">
          Range: ${min_price} - ${max_price}
        </p>
      </div>
    </div>

    {/* ২. Place A Bid Form  */}
    <section className="p-6 w-full bg-white rounded-md shadow-md flex-1 md:min-h-[350px]">
      
      {/* condition a rendaring*/}
      {job.status === "Closed" ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-red-100 p-6 text-red-600 font-bold rounded-lg text-center border border-red-200">
            <h2 className="text-xl mb-2">Hire Completed!</h2>
            <p>This job is no longer accepting bids. The buyer has already hired someone.</p>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-gray-700 capitalize ">
            Place A Bid
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
              <div>
                <label className="text-gray-700 " htmlFor="price">Price</label>
                <input id="price" type="text" name="price" required className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" />
              </div>

              <div>
                <label className="text-gray-700 " htmlFor="emailAddress">Email Address</label>
                <input defaultValue={user?.email} id="emailAddress" type="email" name="email" disabled className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md" />
              </div>

              <div>
                <label className="text-gray-700 " htmlFor="comment">Comment</label>
                <input id="comment" name="comment" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" />
              </div>
              
              <div className="flex flex-col gap-2 ">
                <label className="text-gray-700">Deadline</label>
                <DatePicker className="border p-2 rounded-md w-full" selected={startDate} onChange={(date) => setStartDate(date)} />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button type="submit" className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                Place Bid
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  </div>
);
};

export default JobDetails;
