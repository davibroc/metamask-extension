import React from 'react'
import assert from 'assert'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import CurrencyInput from '../currency-input.component'
import UnitInput from '../../unit-input'
import CurrencyDisplay from '../../currency-display'

describe('CurrencyInput Component', () => {
  describe('rendering', () => {
    it('should render properly without a suffix', () => {
      const wrapper = shallow(
        <CurrencyInput />
      )

      assert.ok(wrapper)
      assert.equal(wrapper.find(UnitInput).length, 1)
    })

    it('should render properly with a suffix', () => {
      const mockStore = {
        metamask: {
          currentCurrency: 'usd',
          conversionRate: 231.06,
        },
      }
      const store = configureMockStore()(mockStore)

      const wrapper = mount(
        <Provider store={store}>
          <CurrencyInput
            suffix="ETH"
          />
        </Provider>
      )

      assert.ok(wrapper)
      assert.equal(wrapper.find('.unit-input__suffix').length, 1)
      assert.equal(wrapper.find('.unit-input__suffix').text(), 'ETH')
      assert.equal(wrapper.find(CurrencyDisplay).length, 1)
    })

    it('should render properly with an ETH value', () => {
      const mockStore = {
        metamask: {
          currentCurrency: 'usd',
          conversionRate: 231.06,
        },
      }
      const store = configureMockStore()(mockStore)

      const wrapper = mount(
        <Provider store={store}>
          <CurrencyInput
            value="de0b6b3a7640000"
            suffix="ETH"
            currentCurrency="usd"
            conversionRate={231.06}
          />
        </Provider>
      )

      assert.ok(wrapper)
      const currencyInputInstance = wrapper.find(CurrencyInput).at(0).instance()
      assert.equal(currencyInputInstance.state.decimalValue, 1)
      assert.equal(currencyInputInstance.state.hexValue, 'de0b6b3a7640000')
      assert.equal(wrapper.find('.unit-input__suffix').length, 1)
      assert.equal(wrapper.find('.unit-input__suffix').text(), 'ETH')
      assert.equal(wrapper.find('.unit-input__input').props().value, '1')
      assert.equal(wrapper.find('.currency-display-component').text(), '$231.06 USD')
    })

    it('should render properly with a fiat value', () => {
      const mockStore = {
        metamask: {
          currentCurrency: 'usd',
          conversionRate: 231.06,
        },
      }
      const store = configureMockStore()(mockStore)

      const wrapper = mount(
        <Provider store={store}>
          <CurrencyInput
            value="f602f2234d0ea"
            suffix="USD"
            useFiat
            currentCurrency="usd"
            conversionRate={231.06}
          />
        </Provider>
      )

      assert.ok(wrapper)
      const currencyInputInstance = wrapper.find(CurrencyInput).at(0).instance()
      assert.equal(currencyInputInstance.state.decimalValue, 1)
      assert.equal(currencyInputInstance.state.hexValue, 'f602f2234d0ea')
      assert.equal(wrapper.find('.unit-input__suffix').length, 1)
      assert.equal(wrapper.find('.unit-input__suffix').text(), 'USD')
      assert.equal(wrapper.find('.unit-input__input').props().value, '1')
      assert.equal(wrapper.find('.currency-display-component').text(), '0.004328 ETH')
    })
  })

  describe('handling actions', () => {
    const handleChangeSpy = sinon.spy()
    const handleBlurSpy = sinon.spy()

    afterEach(() => {
      handleChangeSpy.resetHistory()
      handleBlurSpy.resetHistory()
    })

    it('should call onChange and onBlur on input changes with the hex value for ETH', () => {
      const mockStore = {
        metamask: {
          currentCurrency: 'usd',
          conversionRate: 231.06,
        },
      }
      const store = configureMockStore()(mockStore)
      const wrapper = mount(
        <Provider store={store}>
          <CurrencyInput
            onChange={handleChangeSpy}
            onBlur={handleBlurSpy}
            suffix="ETH"
            currentCurrency="usd"
            conversionRate={231.06}
          />
        </Provider>
      )

      assert.ok(wrapper)
      assert.equal(handleChangeSpy.callCount, 0)
      assert.equal(handleBlurSpy.callCount, 0)

      const currencyInputInstance = wrapper.find(CurrencyInput).at(0).instance()
      assert.equal(currencyInputInstance.state.decimalValue, 0)
      assert.equal(currencyInputInstance.state.hexValue, undefined)
      assert.equal(wrapper.find('.currency-display-component').text(), '$0.00 USD')
      const input = wrapper.find('input')
      assert.equal(input.props().value, 0)

      input.simulate('change', { target: { value: 1 } })
      assert.equal(handleChangeSpy.callCount, 1)
      assert.ok(handleChangeSpy.calledWith('de0b6b3a7640000'))
      assert.equal(wrapper.find('.currency-display-component').text(), '$231.06 USD')
      assert.equal(currencyInputInstance.state.decimalValue, 1)
      assert.equal(currencyInputInstance.state.hexValue, 'de0b6b3a7640000')

      assert.equal(handleBlurSpy.callCount, 0)
      input.simulate('blur')
      assert.equal(handleBlurSpy.callCount, 1)
      assert.ok(handleBlurSpy.calledWith('de0b6b3a7640000'))
    })

    it('should call onChange and onBlur on input changes with the hex value for fiat', () => {
      const mockStore = {
        metamask: {
          currentCurrency: 'usd',
          conversionRate: 231.06,
        },
      }
      const store = configureMockStore()(mockStore)
      const wrapper = mount(
        <Provider store={store}>
          <CurrencyInput
            onChange={handleChangeSpy}
            onBlur={handleBlurSpy}
            suffix="USD"
            currentCurrency="usd"
            conversionRate={231.06}
            useFiat
          />
        </Provider>
      )

      assert.ok(wrapper)
      assert.equal(handleChangeSpy.callCount, 0)
      assert.equal(handleBlurSpy.callCount, 0)

      const currencyInputInstance = wrapper.find(CurrencyInput).at(0).instance()
      assert.equal(currencyInputInstance.state.decimalValue, 0)
      assert.equal(currencyInputInstance.state.hexValue, undefined)
      assert.equal(wrapper.find('.currency-display-component').text(), '0 ETH')
      const input = wrapper.find('input')
      assert.equal(input.props().value, 0)

      input.simulate('change', { target: { value: 1 } })
      assert.equal(handleChangeSpy.callCount, 1)
      assert.ok(handleChangeSpy.calledWith('f602f2234d0ea'))
      assert.equal(wrapper.find('.currency-display-component').text(), '0.004328 ETH')
      assert.equal(currencyInputInstance.state.decimalValue, 1)
      assert.equal(currencyInputInstance.state.hexValue, 'f602f2234d0ea')

      assert.equal(handleBlurSpy.callCount, 0)
      input.simulate('blur')
      assert.equal(handleBlurSpy.callCount, 1)
      assert.ok(handleBlurSpy.calledWith('f602f2234d0ea'))
    })

    it('should change the state and pass in a new decimalValue when props.value changes', () => {
      const mockStore = {
        metamask: {
          currentCurrency: 'usd',
          conversionRate: 231.06,
        },
      }
      const store = configureMockStore()(mockStore)
      const wrapper = shallow(
        <Provider store={store}>
          <CurrencyInput
            onChange={handleChangeSpy}
            onBlur={handleBlurSpy}
            suffix="USD"
            currentCurrency="usd"
            conversionRate={231.06}
            useFiat
          />
        </Provider>
      )

      assert.ok(wrapper)
      const currencyInputInstance = wrapper.find(CurrencyInput).dive()
      assert.equal(currencyInputInstance.state('decimalValue'), 0)
      assert.equal(currencyInputInstance.state('hexValue'), undefined)
      assert.equal(currencyInputInstance.find(UnitInput).props().value, 0)

      currencyInputInstance.setProps({ value: '1ec05e43e72400' })
      currencyInputInstance.update()
      assert.equal(currencyInputInstance.state('decimalValue'), 2)
      assert.equal(currencyInputInstance.state('hexValue'), '1ec05e43e72400')
      assert.equal(currencyInputInstance.find(UnitInput).props().value, 2)
    })
  })
})
