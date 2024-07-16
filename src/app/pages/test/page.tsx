// // src/app/pages/test/page.tsx

// import { fetchServicesByStatus } from "../../api/service";

// type Service = {
//   serviceId: number;
//   serviceName: string;
//   description: string;
//   price: number;
//   staffId: number;
//   promotionId: number | null;
//   status: number;
// };

// const ServicesPage = async ({ params }: { params: { status: number } }) => {
//   const status = params.status || 1; // Default status is 'active'
//   let services: Service[] = [];

//   try {
//     services = await fetchServicesByStatus(status);
//     console.log("Services:", services);
//   } catch (error) {
//     console.error("Failed to fetch services:", error);
//   }

//   return (
//     <div>
//       <h1>Services</h1>
//       <ul>
//         {services.length > 0 ? (
//           services.map((service) => (
//             <li key={service.serviceId}>{service.serviceName}</li>
//           ))
//         ) : (
//           <li>No services available</li>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default ServicesPage;
