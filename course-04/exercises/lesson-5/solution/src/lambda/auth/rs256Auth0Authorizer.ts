
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDDCCAfSgAwIBAgIIGK/tyJ0JQO4wDQYJKoZIhvcNAQELBQAwJDEiMCAGA1UE
AxMZZGV2LWdhc3FlMXgwLnVzLmF1dGgwLmNvbTAeFw0yMTA3MDUwMzAzMjlaFw0z
NTAzMTQwMzAzMjlaMCQxIjAgBgNVBAMTGWRldi1nYXNxZTF4MC51cy5hdXRoMC5j
b20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC6xsrPlpBb5zBJXaO+
sCg40D3ilSZm60DQSlRHwYiBJuKjRfjWYGEofjrIY1ONjxTuSfQq3OBLwAAW4I7v
Wo+vSrse8/X9Fl1uuyG31dJ/CCtF4jLY5Eb2OUhVnGQNE8h5GD5tb6rqquADt6eR
CNdIFMlo2gylmc11cJngjQ3MF73vfqSIs2jd3k4RTHMCxsuZ9/kzr14xXcMpzffH
EzldbQfBVa0F+x7rFWe8rU4bYo/RLsC4b5uEzLT14rHG7fdfdKvlrJkYRMQHYR7J
3l5KaxvqOulPLBwB9ZNnZ7Vi4igEQn0u+Jm2w+c30qqw7C2WsbyHBHGrM9+fhpwz
b/hXAgMBAAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFAicvAKayTRi
w6gTmd8sceuZljpFMA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEA
Fk9XPWzcCr1i5VcyfyYFm5hBbpLG8w2TEVedHwx2yypf7lVxATlc2nm9PSKu6UCg
RMyLzb01eq1xLVLMjCBU5YF+V80PGOTBtddrxWn/TdmRWRUl3oxubkAYIp6m8bMp
ob3fqjOo3ndOVqeM240SuhT+3kFVy49w3N4dEeSIKeL09lLJS6NEcgQYx0LmUI0f
u/SeD6FpmmqHOBE5LCACHljYHPN7mRgNdHaw39FUvysqELzfd9Nswvr+iN+odIfo
ph1BH+yly7YLMmUCxvbZ4E8+rsVIPBPXQ8+QWKI7q8GiyRrBsT1CURMoULGbRl02
SRcG+EhWr1EB0v1pOVpi7w==
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
