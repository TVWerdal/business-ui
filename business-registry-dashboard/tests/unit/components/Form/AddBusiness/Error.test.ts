import { describe, it, expect, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { VueWrapper } from '@vue/test-utils'
import { FormAddBusinessError, BCRegContactInfo } from '#components'
import { enI18n } from '~~/tests/mocks/i18n'

const testProps: any = {
  businessDetails: {
    isFirm: false,
    isCorporation: false,
    isBenefit: false,
    isCorpOrBenOrCoop: false,
    isCoop: false,
    name: 'Business Name',
    identifier: '1234567890'
  }
}

function mountComp (props = testProps) {
  return mountSuspended(FormAddBusinessError, {
    props,
    global: {
      plugins: [enI18n]
    }
  })
}

describe('<FormAddBusinessError />', () => {
  let wrapper: VueWrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should mount', async () => {
    const props = {
      ...testProps,
      errorObj: {
        type: 'email',
        error: new Error('some error')
      }
    }
    wrapper = await mountComp(props)
    console.log(wrapper.html())
    expect(wrapper).toBeTruthy()
    expect(wrapper.findComponent(BCRegContactInfo).exists()).toBe(true)
  })

  it('renders the correct error message for "email" error type', async () => {
    const props = {
      ...testProps,
      errorObj: {
        type: 'email',
        error: new Error('some error')
      }
    }
    wrapper = await mountComp(props)

    expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.email.title'))
    expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.email.description'))
  })

  it('renders the correct error message for "delegation" error type', async () => {
    const props = {
      ...testProps,
      errorObj: {
        type: 'delegation',
        error: new Error('some error')
      }
    }
    wrapper = await mountComp(props)

    expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.delegation.title'))
    expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.delegation.description'))
  })

  describe("renders correct message for 'other' error type", () => {
    it('should render error text for 401 as coop', async () => {
      const props = {
        businessDetails: {
          ...testProps.businessDetails,
          isCoop: true
        },
        errorObj: {
          type: 'other',
          error: {
            response: {
              status: 401
            }
          }
        }
      }
      wrapper = await mountComp(props)

      expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.other.401.coop.title'))
      expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.other.401.coop.description'))
    })

    it('should render error text for 401 as not coop', async () => {
      const props = {
        ...testProps,
        errorObj: {
          type: 'other',
          error: {
            response: {
              status: 401
            }
          }
        }
      }
      wrapper = await mountComp(props)

      expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.other.401.default.title'))
      expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.other.401.default.description'))
    })

    it('should render error text for 404', async () => {
      const props = {
        ...testProps,
        errorObj: {
          type: 'other',
          error: {
            response: {
              status: 404
            }
          }
        }
      }
      wrapper = await mountComp(props)

      expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.other.404.title'))
      expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.other.404.description'))
    })

    it('should render error text for 406', async () => {
      const props = {
        ...testProps,
        errorObj: {
          type: 'other',
          error: {
            response: {
              status: 406
            }
          }
        }
      }
      wrapper = await mountComp(props)

      expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.other.406.title'))
      expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.other.406.description'))
    })

    it('should render error text for 404', async () => {
      const props = {
        ...testProps,
        errorObj: {
          type: 'other',
          error: {
            response: {
              status: 404
            }
          }
        }
      }
      wrapper = await mountComp(props)

      expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.other.404.title'))
      expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.other.404.description'))
    })

    it('should render error text for other statuses', async () => {
      const props = {
        ...testProps,
        errorObj: {
          type: 'other',
          error: {
            response: {
              status: 1234
            }
          }
        }
      }
      wrapper = await mountComp(props)

      expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.other.default.title'))
      expect(wrapper.text()).toContain(enI18n.global.t('form.manageBusiness.error.other.default.description'))
    })
  })

  it('should emit the retry event when the "Try Again" button is clicked', async () => {
    const props = {
      ...testProps,
      errorObj: {
        type: 'other',
        error: new Error('some error')
      }
    }
    wrapper = await mountComp(props)
    const buttons = wrapper.findAll('button')
    await buttons[1]?.trigger('click')
    expect(wrapper.emitted('retry')).toBeTruthy()
  })

  it('sets screen reader alert text correctly', async () => {
    const props = {
      ...testProps,
      errorObj: {
        type: 'email',
        error: new Error('some error')
      }
    }
    wrapper = await mountComp(props)

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        const status = wrapper.find('[role="status"]')
        expect(status.text()).toContain(enI18n.global.t('form.manageBusiness.error.email.title'))
        expect(status.text()).toContain(enI18n.global.t('form.manageBusiness.error.email.description'))
        console.log(status.html())
        resolve() // resolve after assertion
      }, 1000) // wait for timeout to complete
    })
  })
})
