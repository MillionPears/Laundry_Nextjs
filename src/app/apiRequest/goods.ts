import { GoodsesResType, GoodsResType, GoodsUpdateBodyType } from "../schemaValidations/goods.schema";
import http from "../untils/http";

const goodsApiRequest ={
    getAll:(sessionToken: string)  =>
      http.get<GoodsesResType>(`/goods/getall`,{
        headers: {
        Authorization: `Bearer ${sessionToken}`
      }
      }),
    updateGoods:(body: GoodsUpdateBodyType, goodsId:number) =>
    http.put<(GoodsResType)>(`/goods/update/${goodsId}`,body),
    createGoods: (body: GoodsUpdateBodyType) =>
    http.post<(GoodsResType)>(`/goods/create`,body),
    decreaseQuantity:(goodsId:number) =>
      http.put<(GoodsResType)>(`/goods/decrease/${goodsId}`,null),
    getById:(goodsId:number) =>
      http.get<(GoodsResType)>(`/goods/get/byid/${goodsId}`)
}
export default goodsApiRequest