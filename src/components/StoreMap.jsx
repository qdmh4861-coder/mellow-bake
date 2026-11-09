import { useEffect, useRef, useState } from 'react'

let sdkPromise
function loadMaps(clientId) {
  if (window.naver?.maps?.Service?.geocode) return Promise.resolve(window.naver.maps)
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    let settled = false
    const previousAuthFailure = window.navermap_authFailure
    window.navermap_authFailure = () => {
      window.dispatchEvent(new Event('mellow-bake:map-auth-error'))
      previousAuthFailure?.()
    }
    const finish = error => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      window.removeEventListener('mellow-bake:map-auth-error', authError)
      if (error) { script.remove(); reject(error) }
      else resolve(window.naver.maps)
    }
    const authError = () => finish(new Error('지도 인증에 실패했습니다. Client ID와 등록한 Web 서비스 URL을 확인해 주세요.'))
    const timer = setTimeout(() => finish(new Error('지도 로딩 시간이 초과되었습니다. 네트워크와 Maps 서비스 설정을 확인해 주세요.')), 15000)
    window.addEventListener('mellow-bake:map-auth-error', authError)
    script.async = true
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}&submodules=geocoder`
    script.onload = () => finish(window.naver?.maps?.Service?.geocode ? null : new Error('지도 또는 Geocoding 모듈을 불러오지 못했습니다. 서비스 사용 설정을 확인해 주세요.'))
    script.onerror = () => finish(new Error('지도 스크립트를 불러오지 못했습니다. 네트워크 연결을 확인해 주세요.'))
    document.head.appendChild(script)
  }).catch(error => { sdkPromise = null; throw error })
  return sdkPromise
}

export default function StoreMap({ open, address }) {
  const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID?.trim()
  const canvas = useRef(null)
  const mapRef = useRef(null)
  const [status, setStatus] = useState({ ready: false, message: '' })
  useEffect(() => {
    if (!open || !clientId) return
    let disposed = false, map, marker, observer, timeout
    setStatus({ ready: false, message: '지도와 주소 검색 결과를 불러오는 중입니다.' })
    const fail = message => { if (!disposed) setStatus({ ready: false, message }) }
    const authError = () => fail('지도 인증에 실패했습니다. Client ID와 등록한 Web 서비스 URL을 확인해 주세요.')
    window.addEventListener('mellow-bake:map-auth-error', authError)
    loadMaps(clientId).then(maps => {
      if (disposed) return
      // Search the building address. Unit/floor numbers do not identify a map coordinate.
      const query = address.split(',')[0].trim()
      timeout = setTimeout(() => fail('주소 검색 응답이 지연되고 있습니다. Geocoding 서비스 설정을 확인해 주세요.'), 15000)
      maps.Service.geocode({ query }, (resultStatus, response) => {
        clearTimeout(timeout)
        if (disposed) return
        if (resultStatus !== maps.Service.Status.OK) { fail('주소 검색에 실패했습니다. Geocoding 권한과 이용 한도를 확인해 주세요.'); return }
        const normalize = value => value.replace(/\s+/g, '')
        const exact = (response?.v2?.addresses || []).filter(item => normalize((item.roadAddress || '').split('(')[0]) === normalize(query))
        if (exact.length !== 1) { fail('주소와 일치하는 위치를 하나로 확인하지 못했습니다. 외부 네이버 지도에서 주소를 확인해 주세요.'); return }
        const lat = Number(exact[0].y), lng = Number(exact[0].x)
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) { fail('주소 검색 결과에 유효한 좌표가 없습니다.'); return }
        try {
          const position = new maps.LatLng(lat, lng)
          map = new maps.Map(canvas.current, { center: position, zoom: 17, minZoom: 6, maxZoom: 21, draggable: true, scrollWheel: true, zoomControl: false })
          marker = new maps.Marker({ position, map, title: '주소 검색 결과 (실제 매장 등록 위치가 아닙니다)' })
          mapRef.current = map
          setStatus({ ready: true, message: '' })
          observer = new ResizeObserver(() => { if (!disposed) { maps.Event.trigger(map, 'resize'); map.setCenter(position) } })
          observer.observe(canvas.current)
        } catch { fail('지도를 초기화하지 못했습니다. Maps 서비스 인증과 브라우저 설정을 확인해 주세요.') }
      })
    }).catch(error => fail(error.message))
    return () => {
      disposed = true; clearTimeout(timeout); observer?.disconnect()
      window.removeEventListener('mellow-bake:map-auth-error', authError)
      marker?.setMap(null); map?.destroy(); mapRef.current = null
    }
  }, [open, address, clientId])
  const ready = open && status.ready
  function zoom(amount) { const map = mapRef.current; if (ready && map) map.setZoom(Math.max(6, Math.min(21, map.getZoom() + amount)), true) }
  return <section className={`store-map-unavailable${ready ? ' store-map-live' : ''}`} aria-label="매장 주소 지도">
    <div className="store-map-canvas" ref={canvas} aria-label="주소 검색 결과 지도" style={{ visibility: ready ? 'visible' : 'hidden' }} />
    {!ready && <div className="store-map-load-status" role="status"><h3>{clientId ? '지도 연결 안내' : '지도 API 키 설정 필요'}</h3><p>{clientId ? status.message : 'VITE_NAVER_MAP_CLIENT_ID가 설정되지 않았습니다.'}</p><p>아래 네이버 지도 버튼에서 주소를 검색하고<br />길찾기를 이용해 주세요.</p></div>}
    <div className="store-map-zoom" aria-label="지도 확대 및 축소"><button type="button" disabled={!ready} title={ready ? '확대' : '지도 연결 후 사용 가능'} aria-label="지도 확대" onClick={() => zoom(1)}>+</button><button type="button" disabled={!ready} title={ready ? '축소' : '지도 연결 후 사용 가능'} aria-label="지도 축소" onClick={() => zoom(-1)}>−</button></div>
  </section>
}
