/**
 * MT5 Service - Node.js bridge to MetaTrader 5 Web API
 * This service communicates with the MT5 PHP API to manage trading accounts,
 * sync trading history, and handle real-time trading operations.
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface MT5Config {
  host: string;
  port: number;
  login: string;
  password: string;
  timeout?: number;
}

interface MT5Account {
  login: string;
  group: string;
  name: string;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  leverage: number;
  credit: number;
  currency: string;
}

interface MT5Deal {
  deal: string;
  externalId: string;
  login: string;
  dealer: string;
  order: string;
  action: number;
  entry: number;
  reason: number;
  digits: number;
  digitsC: number;
  contractSize: number;
  time: number;
  symbol: string;
  price: number;
  volume: number;
  profit: number;
  storage: number;
  commission: number;
  rateProfit: number;
  rateMargin: number;
  expertId: string;
  positionId: string;
  comment: string;
}

interface MT5Position {
  position: string;
  externalId: string;
  login: string;
  dealer: string;
  symbol: string;
  action: number;
  digits: number;
  digitsC: number;
  contractSize: number;
  timeCreate: number;
  timeUpdate: number;
  priceOpen: number;
  priceCurrent: number;
  priceSL: number;
  priceTP: number;
  volume: number;
  volumeExt: number;
  profit: number;
  storage: number;
  rateProfit: number;
  rateMargin: number;
  expertId: string;
  comment: string;
}

export class MT5Service {
  private config: MT5Config;
  private phpBinary: string = "php";

  constructor(config: MT5Config) {
    this.config = {
      timeout: 30000,
      ...config,
    };
  }

  /**
   * Execute PHP MT5 API script
   */
  private async executePhpScript(scriptName: string, method: string, params: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, "..", "mt5_api", scriptName);
      
      const phpCode = `
<?php
require_once('${scriptPath}');

// Initialize MT5 API
$api = new MTWebAPI('${this.config.host}', ${this.config.port}, ${this.config.timeout}, true);

try {
    // Connect to MT5 server
    if (!$api->Connect()) {
        throw new Exception('Failed to connect to MT5 server');
    }

    // Authorize
    if (!$api->Authorize('${this.config.login}', '${this.config.password}')) {
        throw new Exception('Failed to authorize');
    }

    // Execute method
    $params = json_decode('${JSON.stringify(params)}', true);
    $result = call_user_func_array([$api, '${method}'], $params);
    
    echo json_encode(['success' => true, 'data' => $result]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    $api->Disconnect();
}
?>
      `;

      const php = spawn(this.phpBinary, ["-r", phpCode]);
      let output = "";
      let errorOutput = "";

      php.stdout.on("data", (data) => {
        output += data.toString();
      });

      php.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      php.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`PHP process exited with code ${code}: ${errorOutput}`));
          return;
        }

        try {
          const result = JSON.parse(output);
          if (result.success) {
            resolve(result.data);
          } else {
            reject(new Error(result.error));
          }
        } catch (error) {
          reject(new Error(`Failed to parse PHP output: ${output}`));
        }
      });
    });
  }

  /**
   * Create a new trading account in MT5
   */
  async createAccount(userInfo: {
    login: string;
    name: string;
    email: string;
    group: string;
    leverage: number;
    password: string;
  }): Promise<MT5Account> {
    try {
      const result = await this.executePhpScript("mt5_user.php", "Add", [userInfo]);
      return result;
    } catch (error) {
      console.error("MT5 Create Account Error:", error);
      throw error;
    }
  }

  /**
   * Get account information from MT5
   */
  async getAccount(login: string): Promise<MT5Account> {
    try {
      const result = await this.executePhpScript("mt5_user.php", "Get", [login]);
      return result;
    } catch (error) {
      console.error("MT5 Get Account Error:", error);
      throw error;
    }
  }

  /**
   * Update account balance (deposit/withdrawal)
   */
  async updateBalance(login: string, amount: number, comment: string = "Balance update"): Promise<boolean> {
    try {
      const result = await this.executePhpScript("mt5_trade.php", "Balance", [
        login,
        amount,
        comment,
      ]);
      return result;
    } catch (error) {
      console.error("MT5 Update Balance Error:", error);
      throw error;
    }
  }

  /**
   * Get trading history (deals) for an account
   */
  async getDeals(login: string, from: number, to: number): Promise<MT5Deal[]> {
    try {
      const result = await this.executePhpScript("mt5_deal.php", "GetPage", [login, from, to]);
      return result;
    } catch (error) {
      console.error("MT5 Get Deals Error:", error);
      throw error;
    }
  }

  /**
   * Get open positions for an account
   */
  async getPositions(login: string): Promise<MT5Position[]> {
    try {
      const result = await this.executePhpScript("mt5_position.php", "Get", [login]);
      return result;
    } catch (error) {
      console.error("MT5 Get Positions Error:", error);
      throw error;
    }
  }

  /**
   * Sync account data from MT5 to database
   */
  async syncAccount(login: string): Promise<{
    balance: number;
    equity: number;
    margin: number;
    freeMargin: number;
    marginLevel: number;
  }> {
    try {
      const account = await this.getAccount(login);
      return {
        balance: account.balance,
        equity: account.equity,
        margin: account.margin,
        freeMargin: account.freeMargin,
        marginLevel: account.marginLevel,
      };
    } catch (error) {
      console.error("MT5 Sync Account Error:", error);
      throw error;
    }
  }

  /**
   * Sync trading history from MT5 to database
   */
  async syncTradingHistory(login: string, from: number, to: number): Promise<MT5Deal[]> {
    try {
      const deals = await this.getDeals(login, from, to);
      return deals;
    } catch (error) {
      console.error("MT5 Sync History Error:", error);
      throw error;
    }
  }

  /**
   * Calculate total profit for a period
   */
  async calculateProfit(login: string, from: number, to: number): Promise<number> {
    try {
      const deals = await this.getDeals(login, from, to);
      const totalProfit = deals.reduce((sum, deal) => sum + deal.profit, 0);
      return totalProfit;
    } catch (error) {
      console.error("MT5 Calculate Profit Error:", error);
      throw error;
    }
  }

  /**
   * Change account password
   */
  async changePassword(login: string, newPassword: string): Promise<boolean> {
    try {
      const result = await this.executePhpScript("mt5_user.php", "PasswordChange", [
        login,
        newPassword,
      ]);
      return result;
    } catch (error) {
      console.error("MT5 Change Password Error:", error);
      throw error;
    }
  }

  /**
   * Check if MT5 connection is alive
   */
  async ping(): Promise<boolean> {
    try {
      await this.executePhpScript("mt5_ping.php", "Ping", []);
      return true;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Create MT5 service instance
 */
export function createMT5Service(): MT5Service {
  const config: MT5Config = {
    host: process.env.MT5_HOST || "127.0.0.1",
    port: parseInt(process.env.MT5_PORT || "443"),
    login: process.env.MT5_MANAGER_LOGIN || "",
    password: process.env.MT5_MANAGER_PASSWORD || "",
    timeout: 30000,
  };

  return new MT5Service(config);
}

// Export singleton instance
export const mt5Service = createMT5Service();

