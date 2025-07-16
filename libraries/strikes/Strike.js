class Strike {
    constructor(uuid, createdAt, reason, punisher, disabled) {
        this.uuid = uuid;
        this.createdAt = createdAt;
        this.reason = reason;
        this.punisher = punisher;
        this.disabled = disabled;
    }
}

export default Strike;