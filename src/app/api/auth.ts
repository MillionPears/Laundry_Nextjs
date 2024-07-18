// import { API_BASE_URL } from './untils/GlobalUrl';


export async function registerUser(values: any) {
  try {
    const response = await fetch('http://localhost:9191/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error('Failed to register user');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}


export default async function fetchCustomer(username:string,forceRefresh = false) {
  const response = await fetch(`http://localhost:9191/api/customer/getbyusername/million/${username}`,{
  cache: forceRefresh ? 'no-store' : 'force-cache'
  } )  
  if(!response.ok)
  {
    console.error("Failed to fetch services");

    throw new Error("Failed to fetch services");
  }
  const responseData = await response.json();
  
  return responseData.data;
}