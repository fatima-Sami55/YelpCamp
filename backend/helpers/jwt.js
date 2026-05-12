const crypto = require('crypto');

const base64url = (input) =>
    Buffer.from(input)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

const decodeBase64url = (input) => {
    const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(normalized, 'base64').toString('utf8');
};

const getSecret = () => process.env.JWT_SECRET || process.env.SECRET || 'thisshouldbeabettersecret!';

module.exports.signToken = (payload, expiresInSeconds = 60 * 60 * 24 * 7) => {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'HS256', typ: 'JWT' };
    const body = {
        ...payload,
        iat: now,
        exp: now + expiresInSeconds
    };

    const unsignedToken = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(body))}`;
    const signature = crypto
        .createHmac('sha256', getSecret())
        .update(unsignedToken)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    return `${unsignedToken}.${signature}`;
};

module.exports.verifyToken = (token) => {
    try {
        if (!token) return null;

        const [encodedHeader, encodedPayload, signature] = token.split('.');
        if (!encodedHeader || !encodedPayload || !signature) return null;

        const unsignedToken = `${encodedHeader}.${encodedPayload}`;
        const expectedSignature = crypto
            .createHmac('sha256', getSecret())
            .update(unsignedToken)
            .digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        const signatureBuffer = Buffer.from(signature);
        const expectedSignatureBuffer = Buffer.from(expectedSignature);
        if (signatureBuffer.length !== expectedSignatureBuffer.length) return null;

        const validSignature = crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer);
        if (!validSignature) return null;

        const payload = JSON.parse(decodeBase64url(encodedPayload));
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

        return payload;
    } catch {
        return null;
    }
};
