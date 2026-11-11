import { registeredProducts } from './productCatalog'
import { productSlug } from './pages/productLinks'
import { storyContent } from './productStoryContent'

const photos = import.meta.glob('./assets/{best-menu,new-menu,new-arrivals}/*.{png,jpg,jpeg,webp}', { eager: true, query: '?url', import: 'default' })
const examplePhoto = name => Object.entries(photos).find(([path]) => path.split('/').at(-1).split('.')[0] === name)?.[1]
// Read-only portfolio examples for public/detail display; never saved as member reviews.
const legacyExamples = [
  ['strawberry-shortcake', '달콤한하루', '딸기와 크림이 잘 어울려요. 부드러운 케이크와 함께 기분 좋은 티타임을 즐겼어요.', '상큼해요'],
  ['chocolate-cake', '초코좋아', '진한 초콜릿 맛이 커피와 잘 어울려요. 촉촉한 식감도 마음에 들어요.', '커피와 잘 어울려요'],
  ['matcha-cake', '초록티타임', '말차의 향과 부드러운 크림의 조화가 좋아요. 차와 함께 즐기기 좋은 메뉴예요.', '부드러워요'],
  ['strawberry-roll-cake', '빵순이', '폭신한 시트에 크림이 부드러워요. 딸기와 함께 먹으니 더 맛있었어요.', '폭신해요'],
  ['fruit-tart', '오늘도디저트', '과일이 올라간 타르트라 보기에도 예뻐요. 달콤한 디저트가 생각날 때 좋아요.', '달콤해요'],
  ['tiramisu', '커피한잔', '커피 향과 크림의 조화가 마음에 들어요. 여유로운 오후에 즐기기 좋았어요.', '커피와 잘 어울려요'],
  ['strawberry-shortcake', '베리베리', '딸기 케이크로 달콤한 시간을 보냈어요. 다음에도 다시 즐기고 싶은 메뉴예요.', '또 먹고 싶어요'],
  ['chocolate-cake', '디저트산책', '초콜릿의 풍미가 느껴지는 케이크예요. 한 조각으로도 기분 좋은 디저트 시간이었어요.', '진한 맛이에요'],
  ['matcha-cake', '녹차라떼', '말차 디저트를 좋아해서 골랐어요. 부드러운 크림과 함께 먹기 좋았어요.', '부드러워요'],
  ['strawberry-roll-cake', '달콤한쉼표', '가볍게 즐기기 좋은 롤케이크예요. 딸기와 크림이 잘 어울렸어요.', '폭신해요'],
].map(([productId, nickname, body, tag], index) => ({
  id: `example-review-${index + 1}`, productId, authorId: `example-author-${index + 1}`,
  nickname, body, tags: [tag], rating: index === 9 ? 4 : 5,
  createdAt: `2026-11-${String(9 - Math.floor(index / 2)).padStart(2, '0')}`,
  photos: index < 6 && examplePhoto(productId) ? [examplePhoto(productId)] : [], isExample: true,
}))

const knownReviewPhotos = import.meta.glob('./assets/reviews/*.{png,jpg,jpeg,webp}', { eager:true, query:'?url', import:'default' })
let cached
export function getExampleReviews() {
 if(cached)return cached
 const unique=[...new Map(registeredProducts.map(p=>[productSlug(p.id),p])).values()]
 const special={ 'bread-1':['버터 향이 진하고 겉은 바삭해요','속은 촉촉하고 짭짤한 맛이 잘 어울려요'], 'bread-7':['시나몬 향이 은은하고 달콤해요','촉촉하고 부드러워 커피와 잘 어울려요'], 'cake-2':['꾸덕하면서도 부드러운 식감이 좋아요','진한 치즈와 구운 윗면이 잘 어울려요'], 'sandwich-5':['불고기가 들어 있어 든든하게 즐겼어요','빵과 채소의 조합이 만족스러워요'] }
 cached=unique.flatMap((product,index)=>{
  const existing=legacyExamples.filter(r=>productSlug(r.productId)===productSlug(product.id)).slice(0,4)
  const content=storyContent(product), name=product.koreanName
  const feature=(special[product.id]?.[0]||content.featureText).replace(/[.!。]$/,'').replace(/즐겨보세요/g,'즐길 수 있었어요').replace(/만나보세요/g,'즐기기 좋았어요').replace(/느껴보세요/g,'느낄 수 있었어요').replace(/전합니다/g,'느낄 수 있었어요').replace(/더했습니다/g,'더한 것 같아요').replace(/담았습니다/g,'맛볼 수 있었어요').replace(/살렸습니다/g,'살린 맛이 좋았어요').replace(/강조했습니다/g,'살린 점이 좋았어요').replace(/어우러집니다/g,'잘 어울려요').replace(/돋보입니다/g,'돋보여요')
  const flavor=content.ingredients.slice(0,2).join('와 ')||name
  const objectName=name+(((name.charCodeAt(name.length-1)-44032)%28)?'을':'를')
  const bodies=[
   objectName+' 골라 여유롭게 즐겨봤어요. '+feature+'. '+flavor+'의 맛이 기분 좋게 남아요.',
   name+'의 맛을 천천히 느껴봤어요. '+(special[product.id]?.[1]||flavor+'의 풍미가 인상적이에요')+'. 취향에 맞는 메뉴를 찾은 것 같아요.',
   (product.category==='drink'?'잠깐 쉬면서 ':'간식으로 ')+objectName+' 골랐어요. '+flavor+'의 맛을 즐기며 한숨 돌릴 수 있었어요. 기분 전환에 잘 어울리는 메뉴예요.',
   (product.category==='drink'?name+' 한 잔을 마셔봤어요. ':objectName+' 맛봤어요. ')+flavor+'의 특징을 느끼며 즐기기 좋았어요. 다음에도 생각날 것 같은 메뉴예요.'
  ]
  const photoName=productSlug(product.id)==='strawberry-cream-cake'?'strawberry-shortcake':product.id==='peach-yogurt-mousse'?'peach-yogurt':null
  const referencePhoto=photoName?Object.entries(knownReviewPhotos).find(([path])=>path.split('/').at(-1).split('.')[0]===photoName)?.[1]:null
  return Array.from({length:4},(_,n)=>{const old=existing[n];return { ...(old||{}),id:old?.id||'portfolio-review-'+product.id+'-'+n,productId:product.id,authorId:'portfolio-example',nickname:old?.nickname||['달콤노트','오후의빵','디저트산책','작은티타임'][n]+' '+String(index+1).padStart(2,'0'),title:old?.title||name+'의 달콤한 순간',body:old?.body||bodies[n],rating:old?.rating||[5,5,4,5][n],createdAt:old?.createdAt||new Date(Date.UTC(2026,10,10)-(index*4+n)*86400000).toISOString(),photos:old?.photos?.length?old.photos:referencePhoto?[referencePhoto]:[],tags:old?.tags||[],artPurpose:['enjoy-1','enjoy-2','enjoy-3','charm-1'][n],isExample:true,isPublic:true} })
 })
 return cached
}
