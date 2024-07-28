import { appConfigRepository } from "../entities/app-config.entity"

const setAppConfig = async ({
  domain,
  key,
  value,
}: {
  domain: string
  key: string
  value: string | number
}) => {
  await appConfigRepository
    .upsert({
      clientId: domain.toString(),
      configKey: key.toString(),
      configValue: value.toString(),
    })
    .go()
}

const getAppConfigValue = async ({
  domain,
  key,
}: {
  domain: string
  key: string
}) => {
  const resultData = getAppConfig({ domain, key })
  return (await resultData).data?.configValue
}
const getAppConfig = async ({
  domain,
  key,
}: {
  domain: string
  key: string
}) => {
  return await appConfigRepository
    .get({
      clientId: domain.toString(),
      configKey: key.toString(),
    })
    .go()
}

export { setAppConfig, getAppConfig, getAppConfigValue }
