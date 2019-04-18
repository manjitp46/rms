import * as ConfigParser from "configparser";
import * as path from "path";

export class ConfigManager {
  private config: ConfigParser;

  public loadConfig(configFileName): ConfigParser {
    this.config = new ConfigParser();
    this.config.read(path.join(__dirname, configFileName));
    return this.config;
  }
}
