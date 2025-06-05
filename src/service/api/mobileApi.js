import instance from "../instance";

// Get Mobile Numbers

export const getMobileNumbers = async () => {
  try {
    const response = await instance.get("mobile-numbers");
    return response;
  } catch (error) {
    throw error;
  }
};


// Add Mobile Number

export const addMobileNumber = async(requiredData)=>{
  try {
    const response = await instance.post('mobile-numbers',requiredData)
    return response
  } catch (error) {
    throw error;
  }
}


// Delete Mobile Number

export const deleteMobileNumber = async(mobileNumber)=>{
  try {
    const response = await instance.delete(`mobile-numbers/${mobileNumber?.id}`)
    return response;
  } catch (error) {
    throw error;
  }
}

// Get Groups and Community

export const getGroups = async (requiredData) => {
  const { mobile_number_id, type } = requiredData;

  let url = `whatsapp-types-names?mobile_number_id=${mobile_number_id}`;

  if (type) {
    url += `&type=${type}`;
  }

  try {
    const response = await instance.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};


// Add Groups and Community

export const addGroups = async (requiredData) => {
  try {
    const response = await instance.post("whatsapp-types-names",requiredData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Enable Disable

export const enableGroupsAndCommunity = async (requiredData) =>{
  try {
    const response = await instance.post('mobile-numbers/enable-type',requiredData)
    return response;
  } catch (error) {
    throw error;
  }
}


// Product List

export const getProductList = async(mobile_number_id)=>{
  try {
    const response = await instance.get(`products?mobile_number_id=${mobile_number_id}`)
    return response;
  } catch (error) {
    console.log("newError",error)
    throw error;
  }
}


// Delete group 

export const deleteGroup = async({id}) =>{
  try {
    const response = await instance.delete(`whatsapp-types-names/${id}`)
    return response;
  } catch (error) {
    throw error;
  }
}


// Send Group

export const sendProduct = async()=>{
   try {
    const response = await instance.post(`products/send`)
    return response;
  } catch (error) {
    throw error;
  }
}
