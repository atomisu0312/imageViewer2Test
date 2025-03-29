'use client';
import { isValidElement, ReactElement, useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css"; // leafletのスタイルシートがないと、プラス-マイナスボタンが表示されない
import { MapContainer, ImageOverlay, useMap, useMapEvent } from "react-leaflet";
import { LatLng, LatLngBounds, CRS } from "leaflet";

function MapControll({ setBounds, loading }) {


  // マップのサイズが変更された時にマップの移動範囲を更新するために準備
  const map = useMap();

  // ウィンドウそのもののサイズ変更を検知した場合の処理
  const handleWindowResize = () => {
    map.invalidateSize({ animate: false }); // これを外すとラグるので残します
  };

  // マウント時にイベントリスナーを追加
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window !== null) {
      // ウィンドウそのものにリサイズイベントを追加
      window.addEventListener('resize', handleWindowResize);

      map.setZoom(1);

      // 描画境界を設定
      setBounds(map.getBounds());

      // マップの移動範囲を制限（これを外すと画像が描画範囲外に飛び出す）
      map.setMaxBounds(map.getBounds());

      // コンポーネントがアンマウントされたときにイベントリスナーを削除
      return () => {
        window.removeEventListener('resize', handleWindowResize);
      };
    }
  }, []);

  // マップに対するリサイズイベント
  // マップのサイズが変更された時にマップの移動範囲を更新するために準備
  const onResize = () => {
    map.setZoom(1);
    setBounds(map.getBounds());
    map.setMaxBounds(map.getBounds());
  }
  useMapEvent('resize', onResize);

  return null;
}

// MapControlを入れて
const App = ({ children }: { children: React.ReactNode }) => {

  // 子コンポーネントが有効な形式であることを確認
  if (!isValidElement(children)) {
    throw new Error("Child Component is not valid");
  }

  // src属性がない場合はエラーを表示
  if (!children.props.src) {
    throw new Error("Child Component must have src attribute");
  }

  const [bounds, setBounds] = useState<LatLngBounds>(new LatLngBounds(new LatLng(0, 0), new LatLng(0, 0)));
  //const [src, setSrc] = useState<string>(children.props.src);
  const src = children.props.src;
  const zoom = 1;
  const zoomStep = 1;

  // 画像がローディング中かどうかを判定
  const [loading, setLoading] = useState<boolean>(true);

  // 子コンポーネントが変更されたとき(画像のロードに成功した時も含む)にsrcを更新
  useEffect(() => {
    setLoading(true);
    const img = new Image();
    img.src = children.props.src;
    img.onload = () => setLoading(false);
    //setSrc(children.props.src);
  }, [children]);

  // ロード中であればLoadingを表示
  // ロードできない場合にもLoading...と表示されるので注意
  if (loading) {
    return <div>Loading...</div>;
  }

  // 子要素が持っているスタイルやクラスの情報
  const childStyle = children.props.style || {};
  const childClassName = children.props.className || '';

  return (

      <div style={{ position: "relative" }}>
        {children}
        {/** リーフレットマップコンテナ */}
        <MapContainer
          center={[0, 0]}
          crs={CRS.Simple}
          zoomAnimation={false}
          scrollWheelZoom={true}
          maxBounds={bounds} // マップの移動範囲を制限
          maxBoundsViscosity={1.0} // マップの移動範囲から外れることを絶対にふせぐ
          zoom={zoom}
          minZoom={1}
          maxZoom={10}
          zoomDelta={zoomStep}
          wheelPxPerZoomLevel={Math.round(36 / zoomStep)} // ホイールでのズーム速度
          attributionControl={false} // デフォルトの著作権表示を非表示
          style={{ ...childStyle, position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, padding: 0, margin: 0 }}
          className={childClassName}
        >
          {/** Map制御用のコンポーネント */}
          <MapControll setBounds={setBounds} loading={loading} />
          {/** 画像 */}
          <ImageOverlay url={src} bounds={bounds} />
        </MapContainer>
      </div >

  );
}

export default App;