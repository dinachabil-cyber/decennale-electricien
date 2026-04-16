<?php

namespace App\Service;

class TokenService
{
    private string $secretKey;

    public function __construct()
    {
        $this->secretKey = $_ENV['JWT_SECRET'] ?? $_SERVER['JWT_SECRET'] ?? 'default-dev-key-change-in-production';
    }

    public function generateToken(int $adminId, string $email): string
    {
        $payload = [
            'sub' => $adminId,
            'email' => $email,
            'iat' => time(),
            'exp' => time() + (86400 * 7)
        ];

        $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payloadEncoded = base64_encode(json_encode($payload));
        $signature = base64_encode(hash_hmac('sha256', $header . '.' . $payloadEncoded, $this->secretKey, true));

        return $header . '.' . $payloadEncoded . '.' . $signature;
    }

    public function validateToken(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payloadEncoded, $signature] = $parts;
        $expectedSignature = base64_encode(hash_hmac('sha256', $header . '.' . $payloadEncoded, $this->secretKey, true));

        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        $payload = json_decode(base64_decode($payloadEncoded), true);

        if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    public function getAdminIdFromToken(string $token): ?int
    {
        $payload = $this->validateToken($token);
        return $payload['sub'] ?? null;
    }
}