let SERVICE_ID = ''
if (window.location.href.includes('staging') || window.location.href.includes('localhost')) {
  SERVICE_ID = 'service_dfy35zv'
} else {
  SERVICE_ID = 'service_egi3zsr'
}

export const EDIT_RETRO_TEMPLATE = 'template_wyi79ig'
export const CREATE_RETRO_TEMPLATE = 'template_mvtzknv'
export default SERVICE_ID
