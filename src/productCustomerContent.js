import { storyContent } from './productStoryContent'

// Customer copy for detail pages only. Review examples keep their existing copy.
// No ingredient quantities, allergen declarations or manufacturing parameters
// are inferred from the illustrations.
export function customerContent(product) {
  const base = storyContent(product)
  const name = product.koreanName
  const drink = product.category === 'drink'
  const sandwich = product.category === 'sandwich'
  const cake = product.category === 'cake'
  const flavors = base.ingredients.slice(0,3).join(' · ')
  const texture = drink ? '한 모금씩 천천히 향과 맛을 느껴보세요.' : sandwich ? '빵과 속재료를 함께 즐기며 한 입의 조화를 느껴보세요.' : cake ? '한 조각을 천천히 즐기며 부드러운 식감과 풍미를 느껴보세요.' : '빵의 결을 따라 한 입씩 맛과 식감을 즐겨보세요.'
  return {
    ...base,
    materialsTitle: `${name}의 풍미를 만나다`,
    materialsText: flavors ? `${flavors}의 매력이 어우러지는 ${name}입니다. ${texture}` : `${name}만의 맛과 향을 즐겨보세요. ${texture}`,
    processTitle: `${name}, 맛을 이루는 순간`,
    process: [
      {title:drink?'향으로 시작하는 한 잔':'풍미의 시작',text:base.featureText,image:'process-1'},
      {title:drink?'맛과 향의 어울림':sandwich?'빵과 속재료의 조화':cake?'부드러운 한 조각':'결마다 담긴 매력',text:texture,image:'process-2'},
      {title:drink?'여유롭게 즐기는 시간':'한 입의 즐거움',text:`${name}${drink?' 한 잔':'의 한 입'}과 함께 좋아하는 순간을 더욱 달콤하게 채워보세요.`,image:'process-3'},
    ],
    charms: base.charms.map((item,index)=>({...item,text:index===0?`${base.featureText} ${texture}`:index===1?`${name}의 맛을 천천히 음미해 보세요. ${drink?'향과 여운을 느끼는 즐거움이 담긴 한 잔입니다.':sandwich?'속재료와 빵이 어우러지는 든든한 한 입을 즐겨보세요.':'좋아하는 음료를 곁들여 나만의 디저트 시간을 만들어보세요.'}`:base.charms[index].text})),
    storage:[
      ['보관 방법','상품에 표시된 보관 방법을 따라 신선하게 보관해 주세요.'],
      ['소비기한','상품에 표시된 소비기한과 개봉 후 안내를 확인해 주세요.'],
      ['맛있게 즐기기',drink?`${name}의 향과 맛을 천천히 음미해 보세요.`:`${name}의 식감과 풍미를 좋아하는 음료와 함께 즐겨보세요.`],
    ],
  }
}
