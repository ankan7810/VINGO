// import React, { useEffect, useState } from 'react'
// import Nav from './Nav'
// import { useSelector } from 'react-redux'
// import axios from 'axios'
// import { serverUrl } from '../App'
// import DeliveryBoyTracking from './DeliveryBoyTracking'
// import { ClipLoader } from 'react-spinners'
// import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar as RechartsBar } from 'recharts'

// function DeliveryBoy() {
//   const { userData, socket } = useSelector(state => state.user)
//   const [currentOrder, setCurrentOrder] = useState()
//   const [showOtpBox, setShowOtpBox] = useState(false)
//   const [availableAssignments, setAvailableAssignments] = useState(null)
//   const [otp, setOtp] = useState("")
//   const [todayDeliveries, setTodayDeliveries] = useState([])
//   const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState("")
//   const [tipsInput, setTipsInput] = useState(0)       // Local tips input
//   const [manualTipAdded, setManualTipAdded] = useState(false) // To hide button after click
//   const [manualTips, setManualTips] = useState(0)     // Added tips to total earning

//   // Watch delivery boy location
//   useEffect(() => {
//     if (!socket || userData.role !== "deliveryBoy") return
//     let watchId
//     if (navigator.geolocation) {
//       watchId = navigator.geolocation.watchPosition(
//         (position) => {
//           const latitude = position.coords.latitude
//           const longitude = position.coords.longitude
//           setDeliveryBoyLocation({ lat: latitude, lon: longitude })
//           socket.emit('updateLocation', {
//             latitude,
//             longitude,
//             userId: userData._id
//           })
//         },
//         (error) => console.log(error),
//         { enableHighAccuracy: true }
//       )
//     }
//     return () => { if (watchId) navigator.geolocation.clearWatch(watchId) }
//   }, [socket, userData])

//   const ratePerDelivery = 1

//   // Total earning including tips
//   const totalEarning = todayDeliveries.reduce((sum, order) => {
//     const base = order.count * ratePerDelivery
//     const orderTips = order.tips ? Number(order.tips) : 0
//     const orderDeliveryFee = order.deliveryFee ? Number(order.deliveryFee) : 0
//     return sum + base + orderTips + orderDeliveryFee
//   }, 0) + manualTips

//   // Fetch assignments
//   const getAssignments = async () => {
//     try {
//       const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true })
//       setAvailableAssignments(result.data)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   // Fetch current order
//   const getCurrentOrder = async () => {
//     try {
//       const result = await axios.get(`${serverUrl}/api/order/get-current-order`, { withCredentials: true })
//       setCurrentOrder(result.data)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const acceptOrder = async (assignmentId) => {
//     try {
//       await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, { withCredentials: true })
//       await getCurrentOrder()
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(() => {
//     socket?.on('newAssignment', (data) => setAvailableAssignments(prev => ([...prev, data])))
//     return () => socket?.off('newAssignment')
//   }, [socket])

//   const sendOtp = async () => {
//     setLoading(true)
//     try {
//       await axios.post(`${serverUrl}/api/order/send-delivery-otp`, {
//         orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id
//       }, { withCredentials: true })
//       setLoading(false)
//       setShowOtpBox(true)
//     } catch (error) {
//       console.log(error)
//       setLoading(false)
//     }
//   }

//   const verifyOtp = async () => {
//     setMessage("")
//     setLoading(true)
//     try {
//       await axios.post(`${serverUrl}/api/order/verify-delivery-otp`, {
//         orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id, otp
//       }, { withCredentials: true })
//       setMessage("OTP Verified Successfully")
//       setShowOtpBox(false)
//       setLoading(false)
//     } catch (error) {
//       console.log(error)
//       setLoading(false)
//       setMessage("OTP Verification Failed")
//     }
//   }

//   const handleTipsChange = (e) => {
//     const value = e.target.value
//     if (value === "" || Number(value) >= 0) {
//       setTipsInput(value)
//     }
//   }

//   const addTips = () => {
//     setManualTips(prev => prev + Number(tipsInput))
//     setTipsInput(0)
//     setManualTipAdded(true) // hide button after adding
//   }

//   const handleTodayDeliveries = async () => {
//     try {
//       const result = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, { withCredentials: true })
//       setTodayDeliveries(result.data)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(() => {
//     getAssignments()
//     getCurrentOrder()
//     handleTodayDeliveries()
//   }, [userData])

//   return (
//     <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
//       <Nav />
//       <div className='w-full max-w-[800px] flex flex-col gap-5 items-center'>
//         {/* Welcome & Location */}
//         <div className='bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2'>
//           <h1 className='text-xl font-bold text-[#ff4d2d]'>Welcome, {userData.fullName}</h1>
//           <p className='text-[#ff4d2d] '>
//             <span className='font-semibold'>Latitude:</span> {deliveryBoyLocation?.lat},
//             <span className='font-semibold'>Longitude:</span> {deliveryBoyLocation?.lon}
//           </p>
//         </div>

//         {/* Today Deliveries & Chart */}
//         <div className='bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100'>
//           <h1 className='text-lg font-bold mb-3 text-[#ff4d2d] '>Today Deliveries</h1>
//           <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={todayDeliveries}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
//               <YAxis allowDecimals={false} />
//               <Tooltip formatter={(value) => [value, "orders"]} labelFormatter={label => `${label}:00`} />
//               <RechartsBar dataKey="count" fill='#ff4d2d' />
//             </BarChart>
//           </ResponsiveContainer>

//           <div className='max-w-sm mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg text-center'>
//             <h1 className='text-xl font-semibold text-gray-800 mb-2'>Today's Earning</h1>
//             <span className='text-3xl font-bold text-green-600'>₹{totalEarning}</span>
//           </div>
//         </div>

//         {/* Available Orders */}
//         {!currentOrder && <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
//           <h1 className='text-lg font-bold mb-4 flex items-center gap-2'>Available Orders</h1>
//           <div className='space-y-4'>
//             {availableAssignments?.length > 0 ? availableAssignments.map((a, index) => (
//               <div className='border rounded-lg p-4 flex justify-between items-center' key={index}>
//                 <div>
//                   <p className='text-sm font-semibold'>{a?.shopName}</p>
//                   <p className='text-sm text-gray-500'><span className='font-semibold'>Delivery Address:</span> {a?.deliveryAddress.text}</p>
//                   <p className='text-xs text-gray-400'>{a.items.length} items | {a.subtotal}</p>
//                 </div>
//                 <button className='bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600' onClick={() => acceptOrder(a.assignmentId)}>Accept</button>
//               </div>
//             )) : <p className='text-gray-400 text-sm'>No Available Orders</p>}
//           </div>
//         </div>}

//         {/* Current Order */}
//         {currentOrder && <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
//           <h2 className='text-lg font-bold mb-3'>📦Current Order</h2>
//           <div className='border rounded-lg p-4 mb-3'>
//             <p className='font-semibold text-sm'>{currentOrder?.shopOrder.shop.name}</p>
//             <p className='text-sm text-gray-500'>{currentOrder.deliveryAddress.text}</p>
//             <p className='text-xs text-gray-400'>{currentOrder.shopOrder.shopOrderItems.length} items | {currentOrder.shopOrder.subtotal}</p>
//           </div>

//           <DeliveryBoyTracking data={{
//             deliveryBoyLocation: deliveryBoyLocation || {
//               lat: userData.location.coordinates[1],
//               lon: userData.location.coordinates[0]
//             },
//             customerLocation: {
//               lat: currentOrder.deliveryAddress.latitude,
//               lon: currentOrder.deliveryAddress.longitude
//             }
//           }} />

//           {/* OTP */}
//           {!showOtpBox && message !== "OTP Verified Successfully" ? (
//             <button className='mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200' onClick={sendOtp} disabled={loading}>
//               {loading ? <ClipLoader size={20} color='white' /> : "Mark As Delivered"}
//             </button>
//           ) : null}

//           {showOtpBox && message !== "OTP Verified Successfully" && (
//             <div className='mt-4 p-4 border rounded-xl bg-gray-50'>
//               <p className='text-sm font-semibold mb-2'>Enter OTP sent to <span className='text-orange-500'>{currentOrder.user.fullName}</span></p>
//               <input type="text" className='w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400' placeholder='Enter OTP' onChange={(e) => setOtp(e.target.value)} value={otp} />
//               <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all cursor-pointer" onClick={verifyOtp}>Submit OTP</button>
//               {message && <p className='text-center text-green-400 text-sm mt-2'>{message}</p>}
//             </div>
//           )}

//           {/* Tips input after OTP verified */}
//           {message === "OTP Verified Successfully" && !manualTipAdded && (
//             <div className='flex gap-2 items-center pt-4'>
//               <input
//                 type="number"
//                 min={0}
//                 placeholder='Enter Tips (0+)' 
//                 value={tipsInput}
//                 onChange={handleTipsChange}
//                 className='w-32 border border-gray-300 rounded-lg px-3 py-2 text-right focus:outline-none text-gray-500 placeholder-gray-400'
//               />
//               <button
//                 className='bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-all'
//                 onClick={addTips}
//               >
//                 Add Tips
//               </button>
//             </div>
//           )}
//         </div>}
//       </div>
//     </div>
//   )
// }

// export default DeliveryBoy







import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { ClipLoader } from 'react-spinners'
import { BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar as RechartsBar } from 'recharts'

function DeliveryBoy() {
  const { userData, socket } = useSelector(state => state.user)
  const [currentOrder, setCurrentOrder] = useState(null)
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [availableAssignments, setAvailableAssignments] = useState([])
  const [otp, setOtp] = useState("")
  const [todayDeliveries, setTodayDeliveries] = useState([])
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [tipsInput, setTipsInput] = useState(0)
  const [manualTipAdded, setManualTipAdded] = useState(false)
  const [manualTips, setManualTips] = useState(0)

  // Watch delivery boy location
  useEffect(() => {
    if (!socket || userData.role !== "deliveryBoy") return
    let watchId
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          setDeliveryBoyLocation({ lat: latitude, lon: longitude })
          socket.emit('updateLocation', {
            latitude,
            longitude,
            userId: userData._id
          })
        },
        (error) => console.log(error),
        { enableHighAccuracy: true }
      )
    }
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId) }
  }, [socket, userData])

  

  // Total earning including tips
  const rateperDelivery=30
  const totalEarning = todayDeliveries.reduce((sum, order) => {
    const orderTips = order.tips ? (Number(order.tips)) :Number(order.count*rateperDelivery)
    return sum + orderTips
  }, rateperDelivery) + manualTips

  // Fetch assignments
  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true })
      setAvailableAssignments(result.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch current order
  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`, { withCredentials: true })
      setCurrentOrder(result.data || null)
      setManualTipAdded(false) // reset when new order comes
    } catch (error) {
      console.log(error)
    }
  }

  const acceptOrder = async (assignmentId) => {
    try {
      await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, { withCredentials: true })
      await getCurrentOrder()
    } catch (error) {
      console.log(error)
    }
  }

  // Listen for new assignments via socket
  useEffect(() => {
    socket?.on('newAssignment', (data) => {
      setAvailableAssignments(prev => prev ? [...prev, data] : [data])
      getCurrentOrder()
    })
    return () => socket?.off('newAssignment')
  }, [socket])

  const sendOtp = async () => {
    setLoading(true)
    try {
      await axios.post(`${serverUrl}/api/order/send-delivery-otp`, {
        orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id
      }, { withCredentials: true })
      setLoading(false)
      setShowOtpBox(true)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setMessage("")
    setLoading(true)
    
    try {
      await axios.post(`${serverUrl}/api/order/verify-delivery-otp`, {
        orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id, otp
      }, { withCredentials: true })
      setMessage("OTP Verified Successfully")
      setShowOtpBox(false)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setMessage("OTP Verification Failed")
    }
  }

  const handleTipsChange = (e) => {
    const value = e.target.value
    if (value === "" || Number(value) >= 0) {
      setTipsInput(value)
    }
  }

  const addTips = () => {
    setManualTips(prev => prev + Number(tipsInput))
    setTipsInput(0)
    setManualTipAdded(true)


    // ✅ Remove current order & force "No Available Orders"
    setCurrentOrder(null)
    setAvailableAssignments([])

    setShowOtpBox(false)
    setMessage("")
    location.reload()
  }

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, { withCredentials: true })
      setTodayDeliveries(result.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAssignments()
    getCurrentOrder()
    handleTodayDeliveries()
  }, [userData])


    useEffect(() => {
    const savedTips = localStorage.getItem("manualTips")
    if (savedTips) {
      setManualTips(Number(savedTips))
    }
  }, [])

    
  // Load saved tips with expiry check
useEffect(() => {
  const savedData = localStorage.getItem("manualTipsData")
  if (savedData) {
    const { value, timestamp } = JSON.parse(savedData)
    const now = Date.now()

    // 24 hours in ms = 86400000
    if (now - timestamp < 86400000) {
      setManualTips(Number(value))
    } else {
      localStorage.removeItem("manualTipsData") // expired → clear
    }
  }
}, [])

// Save tips with timestamp whenever they change
useEffect(() => {
  if (manualTips > 0) {
    localStorage.setItem(
      "manualTipsData",
      JSON.stringify({ value: manualTips, timestamp: Date.now() })
    )
  }
}, [manualTips])


  const rejectOrder = async (assignmentId) => {
  try {
    // Optional: if you have a backend route for reject
    // await axios.get(`${serverUrl}/api/order/reject-order/${assignmentId}`, { withCredentials: true })

    // Remove from local state
    setAvailableAssignments(prev =>
      prev.filter(a => a.assignmentId !== assignmentId)
    )
  } catch (error) {
    console.log(error)
  }
}


  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <Nav />
      <div className='w-full max-w-[800px] flex flex-col gap-5 items-center'>

        {/* Welcome & Location */}
        <div className='bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2'>
          <h1 className='text-xl font-bold text-[#ff4d2d]'>Welcome, {userData.fullName}</h1>
          <p className='text-[#ff4d2d] '>
            <span className='font-semibold'>Latitude:</span> {deliveryBoyLocation?.lat},
            <span className='font-semibold'>Longitude:</span> {deliveryBoyLocation?.lon}
          </p>
        </div>

        {/* Today Deliveries & Chart */}
        <div className='bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100'>
          <h1 className='text-lg font-bold mb-3 text-[#ff4d2d] '>Today Deliveries</h1>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={todayDeliveries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => [value, "orders"]} labelFormatter={label => `${label}:00`} />
              <RechartsBar dataKey="count" fill='#ff4d2d' />
            </BarChart>
          </ResponsiveContainer>

          <div className='max-w-sm mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg text-center'>
            <h1 className='text-xl font-semibold text-gray-800 mb-2'>Today's Earning</h1>
            {/* <span className='text-3xl font-bold text-green-600'>₹{totalEarning}</span> */}
            <span className='text-3xl font-bold text-green-600'>
              ₹{totalEarning}
            </span>
          </div>
        </div>

        {/* Available Orders */}
        {!currentOrder && (
          <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
            <h1 className='text-lg font-bold mb-4 flex items-center gap-2'>Available Orders</h1>
            <div className='space-y-4'>
              {availableAssignments?.length > 0 ? availableAssignments.map((a, index) => (
                <div className='border rounded-lg p-4 flex justify-between items-center' key={index}>
                  <div>
                    <p className='text-sm font-semibold'>{a?.shopName}</p>
                    <p className='text-sm text-gray-500'><span className='font-semibold'>Delivery Address:</span> {a?.deliveryAddress.text}</p>
                    <p className='text-xs text-gray-400'>{a.items.length} items | {a.subtotal}</p>
                  </div>
                  <button className='bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600' onClick={() => acceptOrder(a.assignmentId)}>Accept</button>
                  <button className='bg-orange-500  text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600'  onClick={() => rejectOrder(a.assignmentId)}>Reject</button>
                </div>
              )) : <p className='text-gray-400 text-sm'>No Available Orders</p>}
            </div>
          </div>
        )}

        {/* Current Order */}
        {currentOrder && (
          <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
            <h2 className='text-lg font-bold mb-3'>📦Current Order</h2>
            <div className='border rounded-lg p-4 mb-3'>
              <p className='font-semibold text-sm'>{currentOrder?.shopOrder.shop.name}</p>
              <p className='text-sm text-gray-500'>{currentOrder.deliveryAddress.text}</p>
              <p className='text-xs text-gray-400'>{currentOrder.shopOrder.shopOrderItems.length} items | {currentOrder.shopOrder.subtotal}</p>
            </div>

            <DeliveryBoyTracking data={{
              deliveryBoyLocation: deliveryBoyLocation || {
                lat: userData.location.coordinates[1],
                lon: userData.location.coordinates[0]
              },
              customerLocation: {
                lat: currentOrder.deliveryAddress.latitude,
                lon: currentOrder.deliveryAddress.longitude
              }
            }} />

            {/* OTP */}
            {!showOtpBox && message !== "OTP Verified Successfully" ? (
              <button className='mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200' onClick={sendOtp} disabled={loading}>
                {loading ? <ClipLoader size={20} color='white' /> : "Mark As Delivered"}
              </button>
            ) : null}

            {showOtpBox && message !== "OTP Verified Successfully" && (
              <div className='mt-4 p-4 border rounded-xl bg-gray-50'>
                <p className='text-sm font-semibold mb-2'>Enter OTP sent to <span className='text-orange-500'>{currentOrder.user.fullName}</span></p>
                <input type="text" className='w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400' placeholder='Enter OTP' onChange={(e) => setOtp(e.target.value)} value={otp} />
                <button className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all cursor-pointer" onClick={verifyOtp}>Submit OTP</button>
                {message && <p className='text-center text-green-400 text-sm mt-2'>{message}</p>}
              </div>
            )}

            {/* Tips input after OTP verified */}
            {message === "OTP Verified Successfully" && !manualTipAdded && (
              <div className='flex gap-2 items-center pt-4'>
                <input
                  type="number"
                  min={0}
                  placeholder='Enter Tips (0+)' 
                  value={tipsInput}
                  onChange={handleTipsChange}
                  className='w-32 border border-gray-300 rounded-lg px-3 py-2 text-right focus:outline-none text-gray-500 placeholder-gray-400'
                />
                <button
                  className='bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-all'
                  onClick={addTips}
                >
                  Add Tips
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DeliveryBoy