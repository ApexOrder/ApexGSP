function escapeXml(value?: string | null) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function create7dtdServerConfig(input: {
  serverName: string;
  gamePort: number;
  maxPlayers: number;
  world?: string | null;
  worldSeed?: string | null;
  worldSize?: number | null;
  difficulty?: number | null;
  xpMultiplier?: number | null;
  lootAbundance?: number | null;
  bloodMoonFreq?: number | null;
  bloodMoonCount?: number | null;
  serverPassword?: string | null;
  eacEnabled?: boolean | null;
}) {
  const world = input.world ?? "Navezgane";
  const worldSeed = input.worldSeed ?? "ApexPanel";
  const worldSize = input.worldSize ?? 6144;
  const difficulty = input.difficulty ?? 0;
  const xpMultiplier = input.xpMultiplier ?? 100;
  const lootAbundance = input.lootAbundance ?? 100;
  const bloodMoonFreq = input.bloodMoonFreq ?? 7;
  const bloodMoonCount = input.bloodMoonCount ?? 8;
  const eacEnabled = input.eacEnabled ?? true;
  const gameName = input.serverName.replace(/[^a-zA-Z0-9]/g, "");

  return `<?xml version="1.0"?>
<ServerSettings>
  <property name="ServerName" value="${escapeXml(input.serverName)}"/>
  <property name="ServerDescription" value="Managed by ApexPanel"/>
  <property name="ServerWebsiteURL" value=""/>
  <property name="ServerPassword" value="${escapeXml(input.serverPassword)}"/>
  <property name="ServerLoginConfirmationText" value=""/>
  <property name="Region" value="Europe"/>
  <property name="Language" value="English"/>

  <property name="ServerPort" value="${input.gamePort}"/>
  <property name="ServerVisibility" value="2"/>
  <property name="ServerDisabledNetworkProtocols" value="SteamNetworking"/>
  <property name="ServerMaxPlayerCount" value="${input.maxPlayers}"/>
  <property name="ServerReservedSlots" value="0"/>
  <property name="ServerReservedSlotsPermission" value="100"/>
  <property name="ServerAdminSlots" value="0"/>
  <property name="ServerAdminSlotsPermission" value="0"/>

  <property name="ControlPanelEnabled" value="false"/>
  <property name="TelnetEnabled" value="false"/>
  <property name="TerminalWindowEnabled" value="false"/>

  <property name="EACEnabled" value="${eacEnabled}"/>
  <property name="HideCommandExecutionLog" value="0"/>

  <property name="MaxUncoveredMapChunksPerPlayer" value="131072"/>
  <property name="PersistentPlayerProfiles" value="false"/>

  <property name="GameWorld" value="${escapeXml(world)}"/>
  <property name="WorldGenSeed" value="${escapeXml(worldSeed)}"/>
  <property name="WorldGenSize" value="${worldSize}"/>
  <property name="GameName" value="${escapeXml(gameName)}"/>
  <property name="GameMode" value="GameModeSurvival"/>

  <property name="ZombiesRun" value="0"/>
  <property name="BuildCreate" value="false"/>
  <property name="DayNightLength" value="60"/>
  <property name="DayLightLength" value="18"/>
  <property name="DropOnDeath" value="1"/>
  <property name="DropOnQuit" value="0"/>
  <property name="BedrollDeadZoneSize" value="15"/>
  <property name="BedrollExpiryTime" value="45"/>

  <property name="MaxSpawnedZombies" value="64"/>
  <property name="MaxSpawnedAnimals" value="50"/>
  <property name="EnemySpawnMode" value="true"/>
  <property name="EnemyDifficulty" value="${difficulty}"/>
  <property name="BlockDamagePlayer" value="100"/>
  <property name="BlockDamageAI" value="100"/>
  <property name="BlockDamageAIBM" value="100"/>
  <property name="XPMultiplier" value="${xpMultiplier}"/>
  <property name="LootAbundance" value="${lootAbundance}"/>
  <property name="LootRespawnDays" value="7"/>
  <property name="AirDropFrequency" value="72"/>
  <property name="AirDropMarker" value="false"/>

  <property name="PartySharedKillRange" value="100"/>
  <property name="PlayerKillingMode" value="3"/>

  <property name="BloodMoonFrequency" value="${bloodMoonFreq}"/>
  <property name="BloodMoonRange" value="0"/>
  <property name="BloodMoonWarning" value="8"/>
  <property name="BloodMoonEnemyCount" value="${bloodMoonCount}"/>
</ServerSettings>
`;
}