import Image from "next/image";
import { Suspense } from "react";
import fetchServiceByStatus from "./api/service";

interface DynamicImageProps {
  imageName: string; // Xác định kiểu dữ liệu của imageName là string
}
const getImagePath = (imageName: string) => {
  return `/image/${imageName}.png`; // Thay đổi đường dẫn tùy theo tên ảnh
};

export default async function Home() {
  const data = await fetchServiceByStatus(1, false);
  return (
    <main className="container mx-auto px-4  bg-gray-100">
      {/* Giới thiệu */}
      <section className="flex w-full justify-center bg-blue-50 shadow-lg overflow-hidden py-12">
        <div className="flex flex-col md:flex-row w-full max-w-7xl space-y-8 md:space-y-0 md:space-x-8 p-8">
          <div className="flex flex-col w-full md:w-1/2 space-y-8">
            <div className="rounded-lg text-center">
              <h1 className="text-3xl font-bold text-blue-600">
                Lựa chọn tốt nhất
              </h1>
            </div>
            <div className="rounded-lg text-center">
              <h2 className="text-xl font-bold text-blue-500">
                Chất lượng giặt sẽ là câu trả lời
              </h2>
            </div>
            <div className="p-4 rounded-lg bg-white shadow-md">
              <p className="text-md text-gray-700 leading-relaxed">
                Cuộc sống hiện đại vô cùng bận rộn, thời gian trở thành thứ cực
                kì quý giá, đừng lãng phí nó vào những việc rất bình thường như
                giặt giũ quần áo. Đến với FaugetLaundry, quần áo của bạn sẽ được
                GIẶT SẠCH – SẤY KHÔ – XẾP ĐẸP
              </p>
            </div>
          </div>
          <div className="flex w-full md:w-1/2">
            <Image
              src={getImagePath("home")}
              alt="Example image"
              layout="responsive"
              width={500}
              height={500}
              className="object-cover rounded-lg "
            />
          </div>
        </div>
      </section>

      {/* Lý do lựa chọn chúng tôi */}
      <section className="flex justify-center w-full bg-blue-50 shadow-lg overflow-hidden py-12">
        <div className="max-w-7xl flex flex-col items-center p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-600">
              Lý do chọn chúng tôi
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Module 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center transition-transform transform hover:scale-105">
              <Image
                src={getImagePath("reason1")}
                alt="Example image"
                layout="fixed"
                width={200}
                height={200}
                className="object-cover rounded-lg"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-blue-800">
                  Dịch vụ chuyên nghiệp và tận tình
                </h3>
                <p className="text-sm text-gray-700 mt-2">
                  Cửa hàng của chúng tôi cam kết mang đến dịch vụ giặt ủi chuyên
                  nghiệp và tận tình nhất, từ việc chăm sóc khách hàng đến chất
                  lượng giặt
                </p>
              </div>
            </div>

            {/* Module 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center transition-transform transform hover:scale-105">
              <Image
                src={getImagePath("reason2")}
                alt="Example image"
                layout="fixed"
                width={200}
                height={200}
                className="object-cover rounded-lg"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-blue-800">
                  Tùy chọn linh hoạt
                </h3>
                <p className="text-sm text-gray-700 mt-2">
                  Chúng tôi cung cấp nhiều lựa chọn dịch vụ giặt ủi, bao gồm
                  loại dịch vụ, thời gian giao hàng và các phương thức thanh
                  toán, đáp ứng hoàn toàn nhu cầu và sở thích của người dùng.
                </p>
              </div>
            </div>

            {/* Module 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center transition-transform transform hover:scale-105">
              <Image
                src={getImagePath("reason3")}
                alt="Example image"
                layout="fixed"
                width={200}
                height={200}
                className="object-cover rounded-lg"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-blue-800">
                  Đảm bảo chất lượng cao
                </h3>
                <p className="text-sm text-gray-700 mt-2">
                  Với việc sử dụng các sản phẩm giặt chất lượng cao và quy trình
                  kiểm soát chất lượng nghiêm ngặt, chúng tôi cam kết mang lại
                  quần áo sạch và thơm ngay từ lần đầu tiên.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tất cả dịch vụ */}
      <section className="flex justify-center w-full bg-blue-50 shadow-lg overflow-hidden">
        <div className="flex flex-col w-full max-w-6xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center  text-blue-800">
              Các dịch vụ của chúng tôi
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(data || []).map((item: any) => (
              <div
                key={item.serviceId}
                className="bg-blue-50 rounded-lg overflow-hidden shadow-lg flex flex-col items-center transition-transform transform hover:scale-105"
              >
                <Image
                  src={getImagePath(`service${item.serviceId}`)}
                  alt={item.serviceName}
                  layout="fixed"
                  width={200}
                  height={200}
                  className="object-cover rounded-t-lg"
                />

                <div className="p-4 bg-white w-full text-center">
                  <h3 className="text-lg font-bold text-blue-800">
                    {item.serviceName}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section quy trình giặt ủi */}
      <section className="flex justify-center w-full bg-blue-50 shadow-lg overflow-hidden">
        <div className="flex flex-col w-full max-w-6xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center text-blue-600">
              Quá trình giặt ủi
            </h2>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full">
              <div className="grid grid-cols-6 gap-4">
                {/* Bước 1: Nhận đồ */}
                <div className="col-span-1">
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={getImagePath("process_nhando")}
                      alt="Process image"
                      width={150}
                      height={150}
                      className="object-cover rounded-lg"
                    />
                    <div className="p-4 flex justify-center">
                      <h3 className="text-lg font-bold text-blue-500">
                        Nhận đồ
                      </h3>
                    </div>
                  </div>
                </div>
                {/* Bước 2: Phân loại */}
                <div className="col-span-1">
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={getImagePath("process_phanloai")}
                      alt="Process image"
                      width={150}
                      height={150}
                      className="object-cover rounded-lg"
                    />
                    <div className="p-4 flex justify-center">
                      <h3 className="text-lg font-bold text-blue-500">
                        Phân loại
                      </h3>
                    </div>
                  </div>
                </div>
                {/* Bước 3: Giặt */}
                <div className="col-span-1">
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={getImagePath("process_giat")}
                      alt="Process image"
                      width={150}
                      height={150}
                      className="object-cover rounded-lg"
                    />
                    <div className="p-4 flex justify-center">
                      <h3 className="text-lg font-bold text-blue-500">Giặt</h3>
                    </div>
                  </div>
                </div>
                {/* Bước 4: Sấy */}
                <div className="col-span-1">
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={getImagePath("process_say")}
                      alt="Process image"
                      width={150}
                      height={150}
                      className="object-cover rounded-lg"
                    />
                    <div className="p-4 flex justify-center">
                      <h3 className="text-lg font-bold text-blue-500">Sấy</h3>
                    </div>
                  </div>
                </div>
                {/* Bước 5: Gấp */}
                <div className="col-span-1">
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={getImagePath("process_gap")}
                      alt="Process image"
                      width={150}
                      height={150}
                      className="object-cover rounded-lg"
                    />
                    <div className="p-4 flex justify-center">
                      <h3 className="text-lg font-bold text-blue-500">Gấp</h3>
                    </div>
                  </div>
                </div>
                {/* Bước 6: Giao đồ */}
                <div className="col-span-1">
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={getImagePath("process_giao")}
                      alt="Process image"
                      width={150}
                      height={150}
                      className="object-cover rounded-lg"
                    />
                    <div className="p-4 flex justify-center">
                      <h3 className="text-lg font-bold text-blue-500">
                        Giao đồ
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Bảng giá dịch vụ */}
      <section className="flex justify-center w-full bg-white shadow-lg overflow-hidden">
        <div className="flex flex-col w-full max-w-6xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center text-blue-600">
              Bảng giá giặt ủi tham khảo
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {/* Bảng giá dịch vụ 1 */}
            <div className="relative bg-blue-50 rounded-lg overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-blue-50 opacity-25"></div>
              <div className="relative z-10 p-4">
                <figure className="section-item-top-icon text-lg font-bold text-blue-800 text-center">
                  Daily
                </figure>
                <p className="text-sm text-gray-700 mt-2">
                  Giá gói dịch vụ giặt, sấy và gấp EZClean đã bao gồm nước giặt
                  và nước xả loại tốt trên thị trường.
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  Giá gói dịch vụ giặt, sấy và gấp cao cấp JumboClean đã bao gồm
                  nước giặt và nước xả chất lượng ngoại nhập từ Thái Lan và Hàn
                  Quốc, quần áo sau khi giặt được sấy cùng giấy thơm giúp giữ
                  mùi hương lâu hơn.
                </p>
              </div>
              <div className="p-4">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-blue-50 border border-gray-300">
                    <tr>
                      <th
                        className=" text-center py-2 px-4 text-lg font-semibold text-blue-800 border border-gray-300"
                        colSpan={5}
                      >
                        TRỌNG LƯỢNG QUẦN ÁO
                      </th>
                    </tr>
                    <tr className="bg-gray-100 border border-gray-300">
                      <th></th>
                      <th className="py-2 px-4 border border-gray-300">
                        {"< 3KG"}
                      </th>
                      <th className="py-2 px-4 border border-gray-300">
                        {"< 5KG"}
                      </th>
                      <th className="py-2 px-4 border border-gray-300">
                        {"< 7KG"}
                      </th>
                      <th className="py-2 px-4 border border-gray-300">
                        {"< 10KG"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border border-gray-300">
                        Giặt - Sấy - Gấp - EZClean
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        30.000
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        45.000
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        60.000
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        85.000
                      </td>
                    </tr>
                    <tr className="bg-gray-100">
                      <td className="py-2 px-4 border border-gray-300">
                        Giặt - Sấy - Gấp - Cao cấp Jumbo Clean
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        35.000
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        50.000
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        65.000
                      </td>
                      <td className="py-2 px-4 border border-gray-300">
                        90.000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bảng giá dịch vụ 2 */}
            <div className="bg-blue-50 rounded-lg overflow-hidden shadow-lg">
              <div className="p-4">
                <h3 className="text-lg font-bold text-blue-800 text-center">
                  Plus
                </h3>
                <p className="text-sm text-gray-700 mt-2">
                  Gói Jumbo Plus đã bao gồm các loại nước giặt và nước xả cao
                  cấp loại tốt trên thị trường.
                </p>
              </div>
              <div className="p-4">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-300">
                    <tr>
                      <th className="py-2  text-blue-800">DỊCH VỤ</th>
                      <th className="py-2  text-blue-800">Giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    <tr>
                      <td className="py-2">Chăn, Ga, Mùn, Mền</td>
                      <td className="py-2">30.000/ KG</td>
                    </tr>
                    <tr>
                      <td className="py-2">Gấu bông loại nhỏ (15 - 30cm)</td>
                      <td className="py-2">15.000/ con</td>
                    </tr>
                    <tr>
                      <td className="py-2">Gấu bông loại vừa (60cm)</td>
                      <td className="py-2">40.000/ con</td>
                    </tr>
                    <tr>
                      <td className="py-2">Gấu bông loại lớn (120cm)</td>
                      <td className="py-2">70.000/ con</td>
                    </tr>
                    <tr>
                      <td className="py-2">Giày Sneaker</td>
                      <td className="py-2">30.000/ đôi</td>
                    </tr>
                    <tr>
                      <td className="py-2">Ủi quần áo (Là hơi)</td>
                      <td className="py-2">7.000/ cái</td>
                    </tr>
                    <tr>
                      <td className="py-2">Phụ thu giặt tay</td>
                      <td className="py-2">Từ 5.000 - 10.000/ cái</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
