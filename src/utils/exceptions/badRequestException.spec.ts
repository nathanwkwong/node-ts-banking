import { BadRequestException } from './badRequestException'

describe('BadRequestException', () => {
  it('should create an instance of BadRequestException with the correct message and status', () => {
    const message = 'This is a bad request'
    const exception = new BadRequestException(message)

    expect(exception).toBeInstanceOf(BadRequestException)
    expect(exception.message).toBe(message)
    expect(exception.status).toBe(400)
    expect(exception.name).toBe('BadRequestException')
  })

  it('should inherit from the Error class', () => {
    const message = 'This is a bad request'

    const exception = new BadRequestException(message)

    expect(exception).toBeInstanceOf(Error)
  })
})
