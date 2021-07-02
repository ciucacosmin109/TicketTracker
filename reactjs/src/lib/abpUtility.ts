import AppConsts from './appconst';

declare var abp: any;

export function L_original(key: string, sourceName?: string): string {
  let localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;
  return abp.localization.localize(key, sourceName ? sourceName : localizationSourceName);
}

export function L(key: string, ...args: string[]): string {
  let localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;
  let result : string = abp.localization.localize(key, localizationSourceName);

  for (let i = 0; i < args.length; i++) {
    result = result.replace(`{${i}}`, args[i]);
  }
  return result;
}

export function isGranted(permissionName: string): boolean {
  return abp.auth.isGranted(permissionName);
}

export function getEncriptedAuthToken(): string {
  return abp.utils.getCookieValue("enc_auth_token");
}

export function getCultureName(): string {
  return abp.utils.getCookieValue('Abp.Localization.CultureName');
}