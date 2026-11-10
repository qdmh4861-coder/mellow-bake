// Alpha bounds measured from the edited PNGs. Trim only transparent padding,
// with extra safety space around hats, ears, hands and object corners.
import extendedAssets from './memberCutoutAssets.json'
const assets = {
  ...extendedAssets,
  address: ['address-cutout', 1536, 1024, '314 157 942 747'],
  rabbit: ['claims-rabbit-cutout', 1312, 1199, '151 39 994 1118'],
  desserts: ['claims-desserts-cutout', 1374, 1145, '126 145 1127 901'],
  paymentRabbit: ['payments-rabbit-cutout', 1536, 1024, '332 133 864 748'],
  paymentSymbols: ['payments-symbols-cutout', 1536, 1024, '207 218 1148 605'],
}
export default function MemberCutout({ name, className = '' }) {
  const [file, width, height, box] = assets[name]
  return <svg className={`member-banner-cutout ${className}`} viewBox={box} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><image href={`/images/member-cutouts/${file}.png`} width={width} height={height} /></svg>
}
