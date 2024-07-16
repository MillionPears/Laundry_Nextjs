


export default async function fetchServiceByStatus(status:number,forceRefresh = false) {
  const response = await fetch(`http://localhost:9191/api/service/getall/bystatus/${status}`,{
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



