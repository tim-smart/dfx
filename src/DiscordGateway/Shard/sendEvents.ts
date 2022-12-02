export const heartbeat = (d: Discord.Heartbeat): Discord.GatewayPayload => ({
  op: Discord.GatewayOpcode.HEARTBEAT,
  d,
})

export const identify = (d: Discord.Identify): Discord.GatewayPayload => ({
  op: Discord.GatewayOpcode.IDENTIFY,
  d,
})

export const resume = (d: Discord.Resume): Discord.GatewayPayload => ({
  op: Discord.GatewayOpcode.RESUME,
  d,
})

export const requestGuildMembers = (
  d: Discord.RequestGuildMember,
): Discord.GatewayPayload => ({
  op: Discord.GatewayOpcode.REQUEST_GUILD_MEMBERS,
  d,
})

export const voiceStateUpdate = (
  d: Discord.UpdateVoiceState,
): Discord.GatewayPayload => ({
  op: Discord.GatewayOpcode.VOICE_STATE_UPDATE,
  d,
})

export const presenceUpdate = (
  d: Discord.UpdatePresence,
): Discord.GatewayPayload => ({
  op: Discord.GatewayOpcode.PRESENCE_UPDATE,
  d,
})
