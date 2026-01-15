"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ChapaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let ChapaService = ChapaService_1 = class ChapaService {
    configService;
    logger = new common_1.Logger(ChapaService_1.name);
    baseUrl = 'https://api.chapa.co/v1';
    secretKey;
    constructor(configService) {
        this.configService = configService;
        const rawKey = this.configService.get('CHAPA_SECRET_KEY') ?? '';
        this.secretKey = rawKey.replace(/^["'](.+)["']$/, '$1').trim();
        if (!this.secretKey) {
            this.logger.warn('CHAPA_SECRET_KEY not configured. Payment processing will fail.');
        }
        else {
            this.logger.log(`Chapa initialized with key: ${this.secretKey.substring(0, 12)}... (length: ${this.secretKey.length})`);
        }
    }
    async initializePayment(data) {
        try {
            this.logger.log(`Initializing payment for tx_ref: ${data.tx_ref}`);
            const response = await axios_1.default.post(`${this.baseUrl}/transaction/initialize`, data, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                },
            });
            this.logger.log(`Payment initialized successfully: ${data.tx_ref}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to initialize payment: ${error.message}`, error.stack);
            if (axios_1.default.isAxiosError(error) && error.response) {
                const apiMessage = error.response.data?.message || 'Gateway error';
                throw new Error(`Payment gateway error: ${apiMessage}`);
            }
            throw new Error(`Chapa payment initialization failed: ${error.message}`);
        }
    }
    async verifyPayment(txRef) {
        try {
            this.logger.log(`Verifying payment for tx_ref: ${txRef}`);
            const response = await axios_1.default.get(`${this.baseUrl}/transaction/verify/${txRef}`, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                },
            });
            this.logger.log(`Payment verification result: ${response.data.data.status}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to verify payment: ${error.message}`, error.stack);
            throw new Error(`Chapa payment verification failed: ${error.message}`);
        }
    }
    verifyWebhookSignature(payload, signature) {
        const webhookSecret = this.configService.get('CHAPA_WEBHOOK_SECRET');
        if (!webhookSecret) {
            this.logger.warn('CHAPA_WEBHOOK_SECRET not configured. Skipping signature verification.');
            return true;
        }
        const crypto = require('crypto');
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(payload)
            .digest('hex');
        return signature === expectedSignature;
    }
};
exports.ChapaService = ChapaService;
exports.ChapaService = ChapaService = ChapaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ChapaService);
//# sourceMappingURL=chapa.service.js.map