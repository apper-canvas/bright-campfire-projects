import teamMembersData from "@/services/mockData/teamMembers.json";

class TeamMemberService {
  constructor() {
    this.teamMembers = [...teamMembersData];
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay(150);
    return this.teamMembers.map(member => ({ ...member }));
  }

  async getById(id) {
    await this.delay(100);
    const member = this.teamMembers.find(m => m.Id === parseInt(id));
    if (!member) {
      throw new Error("Team member not found");
    }
    return { ...member };
  }

  async getByIds(ids) {
    await this.delay(150);
    const memberIds = ids.map(id => parseInt(id));
    return this.teamMembers
      .filter(member => memberIds.includes(member.Id))
      .map(member => ({ ...member }));
  }

  async create(memberData) {
    await this.delay(300);
    const newMember = {
      Id: Math.max(...this.teamMembers.map(m => m.Id), 0) + 1,
      name: memberData.name,
      email: memberData.email,
      role: memberData.role || "Team Member",
      avatar: this.generateAvatar(memberData.name),
      isActive: true,
      createdAt: new Date().toISOString()
    };
    this.teamMembers.push(newMember);
    return { ...newMember };
  }

  async update(id, memberData) {
    await this.delay(250);
    const index = this.teamMembers.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Team member not found");
    }
    
    this.teamMembers[index] = {
      ...this.teamMembers[index],
      name: memberData.name,
      email: memberData.email,
      role: memberData.role,
      isActive: memberData.isActive !== undefined ? memberData.isActive : this.teamMembers[index].isActive
    };
    
    if (memberData.name) {
      this.teamMembers[index].avatar = this.generateAvatar(memberData.name);
    }
    
    return { ...this.teamMembers[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.teamMembers.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Team member not found");
    }
    this.teamMembers.splice(index, 1);
  }

  generateAvatar(name) {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}

export default new TeamMemberService();