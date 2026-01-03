<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'subscription_type',
        'subscription_starts_at',
        'subscription_ends_at',
        'qr_token',
        'must_change_password',

    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'subscription_starts_at' => 'datetime',
            'subscription_ends_at' => 'datetime',
            'must_change_password' => 'boolean',


        ];
    }

    public function isAdmin(): bool{

        return $this->role === 'admin';

    }   
    public function isMember(): bool {

        return $this->role === 'member';

    }

    public function hasActiveSubscription(): bool{

        if ($this->subscription_type === 'none'){
            return false;

        }
        
        return $this->subscription_ends_at && $this->subscription_ends_at->isFuture();
    }

    public function getSubscriptionDuration(): string {

        return match($this->subscription_type){

            'basic' => '1 hour',
            'standard' => '1 day',
            'premium' => '1 week',
            default => 'No subscription', 

        };
    }

    public function generateQrToken(): void{
        $this->update([
            'qr_token' => Str::uuid(),

        ]);

    }
    
    public function getFullNameAttribute(): string{
        return "{$this->first_name} {$this->last_name}";

    }

    public function attendances(){
        return $this->hasMany(Attendance::class);

    }

}
