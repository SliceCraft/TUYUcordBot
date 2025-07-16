class RoleChecker{
    static isTrialOrAbove(member){
        if(this.isModOrAbove(member)) return true;

        return member.roles.cache.has(process.env.TRIAL_ROLE);
    }

    static isModOrAbove(member){
        if(this.isAdmin(member)) return true;

        return member.roles.cache.has(process.env.MOD_ROLE);
    }

    static isAdmin(member){
        return member.roles.cache.has(process.env.ADMIN_ROLE) || member.roles.cache.has(process.env.SERVER_TECHNICIAN_ROLE);
    }
}

export default RoleChecker;